import React from 'react';
import useCanvas from './CanvasHook';
import Game from './Game';

interface CanvasProps{
    game : Game;
}
const Canvas : React.FunctionComponent<CanvasProps> = props => {
    let game = props.game;
    const canvasRef = useCanvas(game);

    return (
        <canvas ref={canvasRef} width={game.width} height={game.height} />
    );
}

export default Canvas;