import Game from './Game';
import Ball from './Ball';

class GameObject {
    game: Game;
    width: number;
    height: number;
    x: number;
    y: number;

    constructor(game: Game, width: number, height: number, x: number, y: number) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    update(dt: number) {

    }

    draw(ctx: any, dt: number) {
        this.update(dt);
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collision(box: Ball) {
        let boxLeft = box.x;
        let boxRight = boxLeft + box.width;
        let boxTop = box.y;
        let boxBottom = boxTop + box.height;

        let oldBoxLeft = box.oldX;
        let oldBoxRight = oldBoxLeft + box.width;
        let oldBoxTop = box.oldY;
        let oldBoxBottom = oldBoxTop + box.height;

        let myLeft = this.x;
        let myRight = myLeft + this.width;
        let myTop = this.y;
        let myBottom = myTop + this.height;

        if (boxLeft < myRight && boxRight > myLeft && boxTop < myBottom && boxBottom > myTop) {
            let left = oldBoxRight < myLeft && boxRight >= myLeft;
            let right = oldBoxLeft >= myRight && boxLeft < myRight;
            let top = oldBoxBottom < myTop && boxBottom >= myTop;
            let bot = oldBoxTop >= myBottom && boxTop < myBottom;

            if (top || bot) {
                box.dirY *= -1;
            }
            if (right || left) {
                box.dirX *= -1;
            }
            if (top || bot || right || left)
                box.onCollision();
        }
    }
};

export default GameObject;