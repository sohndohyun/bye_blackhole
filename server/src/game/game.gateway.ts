import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import axios from 'axios';

interface JoinData {
  name: string;
  speed: boolean;
  ladder: boolean;
}

interface MatchWithData {
  name: string;
  speed: boolean;
}

class clInfo {
  sock: Socket;
  name: string;
  score: number;
  constructor(sock: Socket, name: string) {
    this.sock = sock;
    this.name = name;
    this.score = 0;
  }
}

class Game {
  a: clInfo;
  b: clInfo;
  observer: Array<Socket>;
  id: number;

  speed: boolean;
  ladder: boolean;

  constructor(
    id: number,
    a: clInfo,
    b: clInfo,
    speed: boolean,
    ladder: boolean,
  ) {
    this.a = a;
    this.b = b;
    this.a.score = 0;
    this.b.score = 0;
    this.id = id;
    this.speed = speed;
    this.ladder = ladder;
    this.observer = new Array<Socket>();
  }

  startGame() {
    let angle = Math.random() * 240;
    angle = angle > 60 ? angle + 60 : angle;
    angle = angle > 250 ? angle + 60 : angle;
    angle *= Math.PI / 180;
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);

    this.emitAll('Scored', {
      scoreL: this.a.score,
      scoreR: this.b.score,
      dirX: dx,
      dirY: dy,
    });

    console.log(`dx : ${dx}, dy : ${dy}`);
  }

  AddUser(socket: Socket) {
    this.observer.push(socket);
  }

  emitAll(ev: string, payload: any) {
    this.a.sock.emit(ev, payload);
    this.b.sock.emit(ev, payload);
    for (let entry of this.observer) entry.emit(ev, payload);
  }

  onAction(socket: Socket, ev: string, pos: number) {
    if (socket.id === this.a.sock.id) {
      this.emitAll(ev, { who: 0, y: pos });
    } else if (socket.id === this.b.sock.id) {
      this.emitAll(ev, { who: 1, y: pos });
    }
  }

  onUpdate(payload: any) {
    this.emitAll('Update', payload);
  }

  finishAxios = async (
    p1: string,
    p2: string,
    winner: string,
    ladder: boolean,
    who: number,
  ) => {
    if (who != 0)
      await axios.patch('http://localhost:8080/profile/userState', {
        id: p1,
        state: 'on',
      });
    if (who != 1)
      await axios.patch('http://localhost:8080/profile/userState', {
        id: p2,
        state: 'on',
      });
    await axios.post('http://localhost:8080/match-history', {
      p1_id: p1,
      p2_id: p2,
      winner: winner,
      ladder: ladder,
    });
  };

  onScored(payload: number): boolean {
    if (payload === 0) {
      ++this.a.score;
      if (this.a.score >= 11) {
        this.emitAll('finish', 0);

        this.finishAxios(this.a.name, this.b.name, this.a.name, this.ladder, 2);
        return true;
      }
    } else if (payload === 1) {
      ++this.b.score;
      if (this.b.score >= 11) {
        this.emitAll('finish', 1);

        this.finishAxios(this.a.name, this.b.name, this.b.name, this.ladder, 2);
        return true;
      }
    } else return false;

    this.startGame();
    return false;
  }

  disconnected(socket: Socket): number {
    if (this.a.sock.id === socket.id) {
      this.b.sock.emit('finish', 1);
      for (let entry of this.observer) entry.emit('finish', 1);

      this.finishAxios(this.a.name, this.b.name, this.b.name, this.ladder, 0);
      return 0;
    } else if (this.b.sock.id === socket.id) {
      this.a.sock.emit('finish', 0);
      for (let entry of this.observer) entry.emit('finish', 0);

      this.finishAxios(this.a.name, this.b.name, this.a.name, this.ladder, 1);
      return 1;
    } else {
      this.observer.splice(this.observer.indexOf(socket), 1);
      return 2;
    }
  }
}

@WebSocketGateway({ namespace: 'game' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {
    this.gameCount = 0;
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('PongGateway');
  private clisNorm: Array<clInfo> = new Array<clInfo>();
  private clisSpeed: Array<clInfo> = new Array<clInfo>();
  private clisLadder: Array<clInfo> = new Array<clInfo>();
  private clisSL: Array<clInfo> = new Array<clInfo>();
  private socks: Array<clInfo> = new Array<clInfo>();
  private checks: Array<clInfo> = new Array<clInfo>();

  private games: Array<Game> = new Array<Game>();
  private gameCount: number;

  getCl(speed: boolean, ladder: boolean): Array<clInfo> {
    if (speed) {
      if (ladder) return this.clisSL;
      else return this.clisSpeed;
    } else {
      if (ladder) return this.clisLadder;
      else return this.clisNorm;
    }
  }

  getClSocket(client: Socket): Array<clInfo> {
    for (let entry of this.clisSL) {
      if (entry.sock.id == client.id) {
        return this.clisSL;
      }
    }
    for (let entry of this.clisSpeed) {
      if (entry.sock.id == client.id) {
        return this.clisSpeed;
      }
    }
    for (let entry of this.clisLadder) {
      if (entry.sock.id == client.id) {
        return this.clisLadder;
      }
    }
    for (let entry of this.clisNorm) {
      if (entry.sock.id == client.id) {
        return this.clisNorm;
      }
    }
    return null;
  }

  pushCl(sock: Socket, name: string, speed: boolean, ladder: boolean): boolean {
    let clis = this.getCl(speed, ladder);

    for (let entry of clis) {
      if (entry.name == name) return false;
    }
    for (let entry of this.socks) {
      if (entry.name == name) {
        this.socks.splice(this.socks.indexOf(entry), 1);
        break;
      }
    }
    clis.push(new clInfo(sock, name));
    return true;
  }

  findGame(sock: Socket): Game {
    for (let game of this.games) {
      if (game.a.sock.id == sock.id || game.b.sock.id == sock.id) return game;
      for (let ob of game.observer) if (ob.id == sock.id) return game;
    }
    return null;
  }

  findGameWithID(id: number): Game {
    for (let game of this.games) {
      if (game.id == id) return game;
    }
    return null;
  }

  @SubscribeMessage('Con')
  onFirstConnect(client: Socket, data: string) {
    axios.patch('http://localhost:8080/profile/userState', {
      id: data,
      state: 'on',
    });
    this.socks.push(new clInfo(client, data));
    this.checks.push(new clInfo(client, data));
  }

  gamingAxios = (a: string, b: string) => {
    axios.patch('http://localhost:8080/profile/userState', {
      id: a,
      state: 'gaming',
    });
    axios.patch('http://localhost:8080/profile/userState', {
      id: b,
      state: 'gaming',
    });
  };

  @SubscribeMessage('Join')
  async onClientJoin(client: any, data: JoinData) {
    if (!this.pushCl(client, data.name, data.speed, data.ladder)) {
      client.emit('match_failed');
      this.logger.log(`Client joined failed: ${data}:${client.id}`);
      return;
    } else {
      this.logger.log(`Client joined : ${data}:${client.id}`);
    }

    let clis = this.getCl(data.speed, data.ladder);
    if (clis.length >= 2) {
      let a = clis.shift();
      let b = clis.shift();

      this.gamingAxios(a.name, b.name);

      let game = new Game(this.gameCount++, a, b, data.speed, data.ladder);
      this.games.push(game);
      a.sock.emit('matched', {
        a: a.name,
        b: b.name,
        dr: 0,
        ladder: data.ladder,
        speed: data.speed,
      });
      this.logger.log(`${a.sock.id} matched`);
      b.sock.emit('matched', {
        a: a.name,
        b: b.name,
        dr: 1,
        ladder: data.ladder,
        speed: data.speed,
      });
      this.logger.log(`${b.sock.id} matched`);

      game.startGame();

      for (let temp of this.socks) this.onGameList(temp.sock);
    }
  }

  @SubscribeMessage('Observe')
  onClientObserve(client: Socket, data: number) {
    let game = this.findGameWithID(data);
    game.observer.push(client);
    client.emit('matched', {
      a: game.a.name,
      b: game.b.name,
      dr: 2,
      ladder: game.ladder,
      speed: game.speed,
    });
    this.logger.log(`${client.id} observe game ${game.id}`);
  }

  @SubscribeMessage('Up')
  onUp(client: any, data: number) {
    let game = this.findGame(client);
    game.onAction(client, 'Up', data);
    this.logger.log(`${client.id} up`);
  }

  @SubscribeMessage('Down')
  onDown(client: any, data: number) {
    let game = this.findGame(client);
    game.onAction(client, 'Down', data);
    this.logger.log(`${client.id} down`);
  }

  @SubscribeMessage('Stop')
  onStop(client: any, data: number) {
    let game = this.findGame(client);
    game.onAction(client, 'Stop', data);
    this.logger.log(`${client.id} stop`);
  }

  @SubscribeMessage('Scored')
  onScored(client: any, data: number) {
    let game = this.findGame(client);
    if (game.onScored(data)) {
      this.socks.push(game.a);
      this.socks.push(game.b);
      this.games.splice(this.games.indexOf(game), 1);
      for (let temp of this.socks) this.onGameList(temp.sock);
    }
    this.logger.log(`${client.id} scored!`);
  }

  @SubscribeMessage('Update')
  onUpdate(client: any, payload: any) {
    let game = this.findGame(client);
    if (game) game.onUpdate(payload);
    this.logger.log(`update!`);
  }

  @SubscribeMessage('GameList')
  onGameList(client: Socket) {
    let gs = [];
    for (let entry of this.games) {
      gs.push({
        id: entry.id,
        a: entry.a.name,
        b: entry.b.name,
        ladder: entry.ladder,
        speed: entry.speed,
      });
    }
    client.emit('gameList', gs);
    this.logger.log(`${client.id} gameList`);
  }

  @SubscribeMessage('Cancel')
  onGameCancel(client: Socket) {
    let clis = this.getClSocket(client);

    if (clis === null) return;
    for (let temp of clis) {
      if (temp.sock.id === client.id) {
        clis.splice(clis.indexOf(temp), 1);
        this.socks.push(temp);
        client.emit('cancel');
        this.logger.log(`${client.id} cancel`);
        break;
      }
    }
  }

  @SubscribeMessage('Check')
  onCheck(client: Socket, payload: string) {
    for (let temp of this.checks) {
      if (temp.name === payload) {
        client.emit('check', true);
        this.logger.log(`${payload} check true`);
        return;
      }
    }

    client.emit('check', false);
    this.logger.log(`${payload} check false`);
  }

  @SubscribeMessage('MatchWith')
  onMatchWith(client: Socket, e: MatchWithData) {
    let a: clInfo = null;
    let b: clInfo = null;
    for (let temp of this.socks) {
      if (temp.name === e.name) b = temp;
      if (temp.sock.id === client.id) a = temp;
    }
    if (a && b) {
      this.socks.splice(this.socks.indexOf(a), 1);
      this.socks.splice(this.socks.indexOf(b), 1);

      this.gamingAxios(a.name, b.name);

      let game = new Game(this.gameCount++, a, b, e.speed, false);
      this.games.push(game);
      a.sock.emit('matched', {
        a: a.name,
        b: b.name,
        dr: 0,
        ladder: false,
        speed: e.speed,
      });
      this.logger.log(`${a.sock.id} matched`);
      b.sock.emit('matched', {
        a: a.name,
        b: b.name,
        dr: 1,
        ladder: false,
        speed: e.speed,
      });
      this.logger.log(`${b.sock.id} matched`);

      game.startGame();

      for (let temp of this.socks) this.onGameList(temp.sock);
    } else {
      client.emit('match_failed');
    }
    this.logger.log(`${client.id} matchwith`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }

  disconnectAxios = async (id: string) => {
    await axios.patch('http://localhost:8080/profile/userState', {
      id: id,
      state: 'off',
    });
  };

  handleDisconnect(client: Socket) {
    for (let temp of this.checks) {
      if (temp.sock.id === client.id) {
        this.disconnectAxios(temp.name);
        this.checks.splice(this.checks.indexOf(temp), 1);
        this.logger.log(`Client Disconnected : ${temp.name}`);
        break;
      }
    }

    let game = this.findGame(client);
    let clis;
    let n: number;
    if (game !== null) {
      if ((n = game.disconnected(client)) !== 2) {
        if (n === 0) {
          this.socks.push(game.b);
        } else if (n === 1) {
          this.socks.push(game.a);
        }
        this.games.splice(this.games.indexOf(game), 1);
      }
    } else if ((clis = this.getClSocket(client))) {
      for (let temp of clis) {
        if (temp.sock.id === client.id) {
          clis.splice(clis.indexOf(temp), 1);
          break;
        }
      }
    } else {
      for (let temp of this.socks) {
        if (temp.sock.id === client.id) {
          this.socks.splice(this.socks.indexOf(temp), 1);
          break;
        }
      }
    }
    for (let temp of this.socks) this.onGameList(temp.sock);
  }
}
