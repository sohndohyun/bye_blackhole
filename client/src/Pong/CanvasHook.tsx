import { useRef, useEffect } from 'react';
import io from './PongSocket';
import Game, { Update } from './Game';
import { Scored, Moved } from './Game';

let t = 0;

const useCanvas = (game: Game) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas ? canvas.getContext('2d') : null;
        let animationFrameID: number;

        window.addEventListener('keydown', (e) => { game.onKeyDown(e); });
        window.addEventListener('keyup', (e) => { game.onKeyUp(e); });

        io.on('Up', (e: Moved) => { game.onUp(e) });
        io.on('Down', (e: Moved) => { game.onDown(e) });
        io.on('Stop', (e: Moved) => { game.onStop(e) });
        io.on('Scored', (e: Scored) => { game.onScored(e) });
        io.on('Update', (e: Update) => { game.onUpdate(e) });

        const render = () => {
            let dt = (performance.now() - t) / 1000;
            if (t === 0)
                t = performance.now();
            else {
                t = performance.now();
                game.draw(context, dt);
            }
            animationFrameID = window.requestAnimationFrame(render);
        }
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameID);
        };
    }, [game]);



    return canvasRef;
}

export default useCanvas;