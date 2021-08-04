import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import './styles/Lobby.scss';
import plusbtn from '../Images/plusbutton.png';
import SideBar from '../SideBar/SideBar';
import GameListModal from './GameListModal';
import ChatListModal from './ChatListModal';
import ChatList from './ChatList';
import GameList from './GameList';
import socket from '../Pong/PongSocket';
import { GameNode } from './IGameNode';
import Game from '../Pong/Game';

interface MatchData {
  a: string;
  b: string;
  dr: number;
}

let aname = 'a';
let bname = 'b';
let dr = 0;
let row: JSX.Element[] = [];

const Lobby = () => {
  const [MyID, setMyID] = useState('');
  const [connected, setConnected] = useState(false);
  const [matched, setMatched] = useState(false);
  const [loada, setloada] = useState(false);
  const [gameList, setGameList] = useState<GameNode[]>([]);

  useEffect(() => {
    const id = sessionStorage.getItem('nickname');
    if (id) setMyID(id);
  });
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      alert('disconnected!');
    });

    socket.on('matched', (e: MatchData) => {
      //여기부터
      aname = e.a;
      bname = e.b;
      dr = e.dr;
      setMatched(true);
      closeGameListModal();
    });

    socket.on('finish', (e: number) => {
      let name = e === 0 ? aname : bname;
      row = [];
      setMatched(false);
      alert(`${name} win!`);
    });

    socket.on('gameList', (e: GameNode[]) => {
      setGameList(e);
      if (loada) setloada(false);
      else setloada(true);
    });
  }, [loada]);

  //game list modal
  const [GameListModalState, setGameListModalState] = useState(false);
  const openGameListModal = () => {
    setGameListModalState(true);
  };
  const closeGameListModal = () => {
    setGameListModalState(false);
  };

  //chat list modal
  const [ChatListModalState, setChatListModalState] = useState(false);
  const openChatListModal = () => {
    setChatListModalState(true);
  };
  const closeChatListModal = () => {
    setChatListModalState(false);
  };

  return matched ? (
    <div>
      <Game a={aname} b={bname} dr={dr} />
    </div>
  ) : (
    <div id="App-Container">
      <span className="App-Left">
        <div className="list-box">
          <div className="listName">
            Game
            <button
              type="button"
              className="plusbtn"
              onClick={openGameListModal}
            >
              <img src={plusbtn} width="30" height="30" />
            </button>
          </div>
          <GameListModal
            open={GameListModalState}
            close={closeGameListModal}
            MyID={MyID}
            connected={connected}
          />
          <hr />
          <GameList gameList={gameList} />
        </div>

        <div className="list-box">
          <div className="listName">
            Chat
            <button
              type="button"
              className="plusbtn"
              onClick={openChatListModal}
            >
              <img src={plusbtn} width="30" height="30" />
            </button>
          </div>
          <ChatListModal
            open={ChatListModalState}
            close={closeChatListModal}
            MyID={MyID}
          />
          <hr />
          <ChatList MyID={MyID} />
        </div>
      </span>
      <span className="App-Right">
        <SideBar />
      </span>
    </div>
  );
};

export default Lobby;
