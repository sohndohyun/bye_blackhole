import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

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

  constructor(id: number, a: clInfo, b: clInfo) {
    this.a = a;
    this.b = b;
    this.id = id;
    this.observer = new Array<Socket>();
  }

  startGame() {
    let angle = Math.random() * 240;
    angle = angle > 60 ? angle + 60 : angle;
    angle = angle > 250 ? angle + 60 : angle;
    angle *= (Math.PI / 180);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);

    this.emitAll('Scored', { scoreL: this.a.score, scoreR: this.b.score, dirX: dx, dirY: dy });
    console.log(`dx : ${dx}, dy : ${dy}`);
  }

  AddUser(socket: Socket) {
    this.observer.push(socket);
  }

  emitAll(ev: string, payload: any) {
    this.a.sock.emit(ev, payload);
    this.b.sock.emit(ev, payload);
    for (let entry of this.observer)
      entry.emit(ev, payload);
  }

  onAction(socket: Socket, ev: string, pos: number) {
    if (socket.id === this.a.sock.id) {
      this.emitAll(ev, { who: 0, y: pos });
    }
    else if (socket.id === this.b.sock.id) {
      this.emitAll(ev, { who: 1, y: pos });
    }
  }

  onUpdate(payload: any) {
    this.emitAll('Update', payload);
  }

  onScored(payload: number): boolean {
    if (payload === 0) {
      ++this.a.score;
      if (this.a.score >= 11) {
        this.emitAll('finish', 0);
        return true;
      }
    }
    else if (payload === 1) {
      ++this.b.score;
      if (this.b.score >= 11) {
        this.emitAll('finish', 1);
        return true;
      }
    }
    else
      return false;

    this.startGame();
    return false;
  }

  disconnected(socket: Socket): boolean {
    if (this.a.sock.id === socket.id) {
      this.b.sock.emit("finish", 0);
      for (let entry of this.observer)
        entry.emit("finish", 0);

      return true;
    }
    else if (this.b.sock.id === socket.id) {
      this.a.sock.emit("finish", 1);
      for (let entry of this.observer)
        entry.emit("finish", 1);

      return true;
    }
    else {
      this.observer.splice(this.observer.indexOf(socket), 1);
      return false;
    }
  }
}

@WebSocketGateway({ namespace: "game" })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor() {
    this.gameCount = 0;
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private clis: Array<clInfo> = new Array<clInfo>();
  private games: Array<Game> = new Array<Game>();
  private gameCount: number;

  pushCl(sock: Socket, name: string): boolean {
    for (let entry of this.clis) {
      if (entry.name == name)
        return false;
    }
    this.clis.push(new clInfo(sock, name));
    return true;
  }

  findGame(sock: Socket): Game {
    for (let game of this.games) {
      if (game.a.sock.id == sock.id || game.b.sock.id == sock.id)
        return game;
      for (let ob of game.observer)
        if (ob.id == sock.id)
          return game;
    }
    return null;
  }

  findGameWithID(id: number): Game {
    for (let game of this.games) {
      if (game.id == id)
        return game;
    }
    return null;
  }

  @SubscribeMessage('Join')
  onClientJoin(client: any, data: string) {
    if (!this.pushCl(client, data)) {
      client.emit('match_failed');
      this.logger.log(`Client joined failed: ${data}:${client.id}`);
      return;
    }
    else {
      this.logger.log(`Client joined : ${data}:${client.id}`);
    }
    if (this.clis.length >= 2) {
      let a = this.clis.shift();
      let b = this.clis.shift();
      let game = new Game(this.gameCount++, a, b);
      this.games.push(game);
      a.sock.emit('matched', { a: a.name, b: b.name, dr: 0 });
      this.logger.log(`${a.sock.id} matched`);
      b.sock.emit('matched', { a: a.name, b: b.name, dr: 1 });
      this.logger.log(`${b.sock.id} matched`);

      game.startGame();
    }
  }

  @SubscribeMessage('Observe')
  onClientObserve(client: Socket, data: number) {
    let game = this.findGameWithID(data);
    game.observer.push(client);
    client.emit('matched', { a: game.a.name, b: game.b.name, dr: 2 });
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
    if (game.onScored(data))
      this.games.splice(this.games.indexOf(game), 1);
    this.logger.log(`${client.id} scored!`);
  }

  @SubscribeMessage('Update')
  onUpdate(client: any, payload: any) {
    let game = this.findGame(client);
    game.onUpdate(payload);
    this.logger.log(`update!`);
  }

  @SubscribeMessage('GameList')
  onGameList(client: Socket) {
    let gs = [];
    for (let entry of this.games) {
      gs.push({ id: entry.id, name: `${entry.a.name} vs ${entry.b.name}` });
    }
    client.emit('gameList', gs);
    this.logger.log(`${client.id} gameList`);
  }

  afterInit(server: Server) { // 서버 시작
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) { // on connect
    this.logger.log(`Client Connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) { // on disconnect
    let game = this.findGame(client);
    if (game !== null) {
      if (game.disconnected(client))
        this.games.splice(this.games.indexOf(game), 1);
    }
    else {
      for (let temp of this.clis) {
        if (temp.sock.id === client.id) {
          this.clis.splice(this.clis.indexOf(temp), 1);
        }
      }
    }
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

}
