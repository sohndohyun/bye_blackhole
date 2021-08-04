import GameObject from './GameObject';

class Wall extends GameObject {
    update(dt: number) {
        super.update(dt);
        if (this.game.pos === 0)
            this.collision(this.game.ball);
    }
}

export default Wall;