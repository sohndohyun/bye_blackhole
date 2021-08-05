import React from 'react';
import { useState, useEffect } from 'react';
import Game from './Game';
import socket from './PongSocket'

interface MatchData {
    a: string,
    b: string,
    dr: number,
    ladder: boolean,
    speed: boolean
}

interface GameNode {
    id: number,
    a: string,
    b: string,
    ladder: boolean,
    speed: boolean
}

let aname = "a";
let bname = "b";
let dr = 0;
let sbool = false;
let lbool = false;
let row: JSX.Element[] = [];

const Pong = () => {
    const [text, setText] = useState('');
    const [searching, setSearching] = useState(false);
    const [connected, setConnected] = useState(false);
    const [matched, setMatched] = useState(false);
    const [loada, setloada] = useState(false);
    const [ladder, setLadder] = useState(false);
    const [speed, setSpeed] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connect");
            setConnected(true);
        });

        socket.on("matched", (e: MatchData) => {
            aname = e.a;
            bname = e.b;
            dr = e.dr;
            sbool = e.speed;
            lbool = e.ladder;
            setMatched(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
            alert("disconnected!");
        });

        socket.on("finish", (e: number) => {
            let name = e === 0 ? aname : bname; 
            row = [];
            setSearching(false);
            setMatched(false);
            alert(`${name} win!`);
        });

        socket.on("gameList", (e: GameNode[]) => {
            row = [];
            for (let g of e) {
                row.push(<button onClick={() => { socket.emit("Observe", g.id); setSearching(true); }}>{g.a + ' vs ' + g.b}</button>);
            }
            if (loada)
                setloada(false);
            else
                setloada(true);
        });

        socket.on("cancel", () => {
            setSearching(false);
        });

    }, [loada]);



    const onChange = (e: any) => {
        setText(e.target.value);
    };

    const onSearch = () => {
        if (text === '')
            alert(`need nickname!`);
        else if (connected) {
            socket.emit('Join', {name: text, speed: speed, ladder: ladder});
            setSearching(true);
            console.log("join start!");
        }
        else
            alert(`not connected!`);
    };

    const onGameSearch = () => {
        if (connected) {
            socket.emit('GameList');
        }
        else
            alert(`not connected!`);
    }

    const onMathCancel = () => {
        if (!matched){
            socket.emit("Cancel");
        }
    }

    if (!searching || !connected) {
        return (
            <div>
                <div>
                    <div><input onChange={onChange} value={text} /></div>
                    <div><label>
                        <input type="checkbox" checked={ladder} onChange={() => {setLadder(!ladder)}} />
                        ladder
                    </label>
                    <label>
                        <input type="checkbox" checked={speed} onChange={() => {setSpeed(!speed)}} />
                        speed
                    </label></div>
                    <div>
                    <button onClick={onSearch}>search</button>
                    <button onClick={onGameSearch}>show game list</button>
                    </div>
                </div>
                <div>{row}</div>
            </div>
        );
    }
    else {
        return !matched ? (
            <div>
                <div>Matching ...</div>
                <button onClick={onMathCancel}>cancel</button>
            </div>
        ) : (
            <div>
                <Game a={aname} b={bname} dr={dr} speed={sbool} ladder={lbool} />
            </div>
        );
    }
}

export default Pong;
