import React from 'react';
import Canvas from './Canvas';
import Ball from './Ball';
import Wall from './Wall';
import Player from './Player';
import GameObject from './GameObject';
import socket from './PongSocket';

export interface Scored {
    scoreL: number,
    scoreR: number,
    dirX: number,
    dirY: number
}

export interface Update {
    x: number,
    y: number,
    dirX: number,
    dirY: number
}

export interface Moved {
    who: number,
    y: number
}

class Game extends React.Component<any, any> {
    objs: GameObject[];
    width: number;
    height: number;

    aname: string;
    bname: string;

    ball: Ball;
    playerL: Player;
    playerR: Player;
    ballSpeed: number;
    isLadder : boolean;
    pos: number;

    constructor(props: {}) {
        super(props);
        this.objs = [];
        this.width = 800;
        this.height = 450;
        this.ball = new Ball(this, 20, 20, this.width / 2, this.height / 2);
        this.playerL = new Player(this, 20, this.height / 4, 0, this.height / 5 * 2);
        this.playerR = new Player(this, 20, this.height / 4, this.width - 20, this.height / 5 * 2);

        this.state = {
            SL: 0,
            SR: 0
        };

        this.pos = this.props.dr;
        this.aname = this.props.a;
        this.bname = this.props.b;
        this.isLadder = this.props.ladder;
        this.ballSpeed = this.props.speed ? 700 : 500;

        this.objs.push(this.playerL);
        this.objs.push(this.playerR);
        this.objs.push(new Wall(this, this.width, 20, 0, 0));
        this.objs.push(new Wall(this, this.width, 20, 0, this.height - 20));
        this.objs.push(new GameObject(this, 10, this.height, this.width / 2 - 5, 0));
        this.objs.push(this.ball);
    }

    receivedMessage(message: string) {
        console.log(message);
    }

    draw(ctx: any, dt: number) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < this.objs.length; i++)
            this.objs[i].draw(ctx, dt);
    }

    onKeyDown(e: KeyboardEvent) {
        if (this.pos >= 2)
            return;

        let mypl = this.pos === 0 ? this.playerL : this.playerR;
        if (e.keyCode === 40 && mypl.dirY !== 1) {
            socket.emit('Down', mypl.y);
        }
        else if (e.keyCode === 38 && mypl.dirY !== -1) {
            socket.emit('Up', mypl.y);
        }
    }

    onKeyUp(e: KeyboardEvent) {
        if (this.pos >= 2)
            return;

        let mypl = this.pos === 0 ? this.playerL : this.playerR;
        if (e.keyCode === 40 || e.keyCode === 38) {
            socket.emit('Stop', mypl.y);
        }
    }

    onUp(e: Moved) {
        if (e.who === 0) {
            this.playerL.dirY = -1;
            this.playerL.y = e.y;
        }
        else if (e.who === 1) {
            this.playerR.dirY = -1;
            this.playerR.y = e.y;
        }
    }

    onDown(e: Moved) {
        if (e.who === 0) {
            this.playerL.dirY = 1;
            this.playerL.y = e.y;
        }
        else if (e.who === 1) {
            this.playerR.dirY = 1;
            this.playerR.y = e.y;
        }
    }

    onStop(e: Moved) {
        if (e.who === 0) {
            this.playerL.dirY = 0;
            this.playerL.y = e.y;
        }
        else if (e.who === 1) {
            this.playerR.dirY = 0;
            this.playerR.y = e.y;
        }
    }

    onScored(e: Scored) {
        this.setState(() => { return { SL: e.scoreL, SR: e.scoreR }; });

        this.ball.start(this.ballSpeed, e.dirX, e.dirY);
    }

    onUpdate(e: Update) {
        this.ball.onUpdate(e);
    }

    onScoredL() {
        if (this.pos === 0) {
            socket.emit('Scored', 0);
        }
    }

    onScoredR() {
        if (this.pos === 0) {
            socket.emit('Scored', 1);
        }
    }

    render() {
        const { SL, SR } = this.state;

        let str = `${this.isLadder ? "LADDER" : "NORMAL"} ${this.aname} ${SL} : ${SR} ${this.bname}`;

        return (
            <div>
                <h1>{str}</h1>
                <Canvas game={this} />
            </div>
        );
    }
}

export default Game;
