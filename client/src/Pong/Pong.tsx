import React from 'react';
import { useState, useEffect } from 'react';
import Game from './Game';
import socket from './PongSocket'

interface MatchData {
    a: string,
    b: string,
    dr: number
}

interface GameNode {
    id: number,
    name: string
}

let aname = "a";
let bname = "b";
let dr = 0;
let row: JSX.Element[] = [];

const Pong = () => {
    const [text, setText] = useState('');
    const [searching, setSearching] = useState(false);
    const [connected, setConnected] = useState(false);
    const [matched, setMatched] = useState(false);
    const [loada, setloada] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connect");
            setConnected(true);
        });

        socket.on("matched", (e: MatchData) => { //여기부터
            aname = e.a;
            bname = e.b;
            dr = e.dr;
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
                row.push(<button onClick={() => { socket.emit("Observe", g.id); setSearching(true); }}>{g.name}</button>);
            }
            if (loada)
                setloada(false);
            else
                setloada(true);
        });

    }, [loada]);



    const onChange = (e: any) => {
        setText(e.target.value);
    };

    const onSearch = () => {
        if (text === '')
            alert(`need nickname!`);
        else if (connected) {
            socket.emit('Join', text);
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

    if (!searching || !connected) {
        return (
            <div>
                <div>
                    <input onChange={onChange} value={text} />
                    <button onClick={onSearch}>search</button>
                    <button onClick={onGameSearch}>show game list</button>
                </div>
                <div>{row}</div>
            </div>
        );
    }
    else {
        return !matched ? (
            <div>
                Matching ...
            </div>
        ) : (
            <div>
                <Game a={aname} b={bname} dr={dr} />
            </div>
        );
    }
}

export default Pong;
