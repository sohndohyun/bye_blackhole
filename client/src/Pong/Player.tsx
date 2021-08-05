import Wall from './Wall';

class Player extends Wall{

    dirY : number;
    speed: number;
    constructor(game : any, width : number, height : number, x : number, y : number){
        super(game, width, height, x, y);
        this.dirY = 0;
        this.speed = 300;
    }

    update(dt : number){
        super.update(dt);

        this.y += this.dirY * this.speed * dt;
        if (this.y < 20 )
            this.y = 20
        else if (this.y > this.game.height - this.height - 20)
            this.y = this.game.height - this.height - 20;
    }
}

export default Player;