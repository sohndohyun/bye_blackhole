import { Update } from './Game';
import GameObject from './GameObject';
import socket from './PongSocket';

class Ball extends GameObject {
    speed: number;
    originX: number;
    originY: number;

    oldX: number;
    oldY: number;
    dirX: number;
    dirY: number;

    coll: boolean;
    pa: boolean;
    constructor(game: any, width: number, height: number, x: number, y: number) {
        super(game, width, height, x, y);

        this.originX = this.game.width / 2 - 10;
        this.originY = this.game.height / 2 - 10;
        this.oldX = this.originX;
        this.oldY = this.originY;
        this.x = this.originX;
        this.y = this.originY;
        this.dirX = 0;
        this.dirY = 0;
        this.speed = 0;
        this.coll = false;
        this.pa = false;
    }

    start(bs: number, dx: number, dy: number) {
        this.speed = bs;
        this.dirX = dx;
        this.dirY = dy;
        this.x = this.originX;
        this.y = this.originY;
        this.oldX = this.x;
        this.oldY = this.y;
    }

    onUpdate(e: Update) {
        this.x = e.x;
        this.y = e.y;
        this.dirX = e.dirX;
        this.dirY = e.dirY;
        this.speed = this.game.ballSpeed;

        this.pa = false;
    }

    paused() {
        this.x = this.originX;
        this.y = this.originY;
        this.oldX = this.x;
        this.oldY = this.y;
        this.speed = this.game.ballSpeed;
    }

    onCollision() {
        this.coll = true;
    }

    update(dt: number) {
        super.update(dt);

        this.oldX = this.x;
        this.oldY = this.y;
        this.x += this.dirX * this.speed * dt;
        this.y += this.dirY * this.speed * dt;

        if (this.game.pos === 0) {
            if (this.x + this.width < 0) {
                this.paused();
                this.game.onScoredR();
            }
            else if (this.x > this.game.width) {
                this.paused();
                this.game.onScoredL();
            }

            if (this.coll === true && !this.pa) {
                socket.emit('Update', { x: this.x, y: this.y, dirX: this.dirX, dirY: this.dirY });
                this.pa = true;
            }

            this.coll = false;
        }
    }
}

export default Ball;