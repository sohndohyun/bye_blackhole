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
import GameResult from './GameResult';
import MatchFailedModal from './MatchFailedModal';
import DirectGameModal from '../SideBar/DirectGameModal';
export interface MatchData {
  a: string;
  b: string;
  dr: number;
  ladder: boolean;
  speed: boolean;
}

let aname = 'a';
let bname = 'b';
let dr = 0;
let sbool = false;
let lbool = false;
let name: string;

const Lobby = () => {
  const [MyID, setMyID] = useState('');
  const [connected, setConnected] = useState(false);
  const [matched, setMatched] = useState(false);
  const [loada, setloada] = useState(false);
  const [gameList, setGameList] = useState<GameNode[]>([]);
  const [gameResult, setGameResult] = useState(false);
  const [MatchFailed, setMatchFailed] = useState(false);
  const [DirectGameTarget, setDirectGameTarget] = useState('');

  useEffect(() => {
    const id = sessionStorage.getItem('nickname');
    if (id) setMyID(id);


    const gameTarget = sessionStorage.getItem('directGame');
    if (gameTarget) {
      setDirectGameTarget(gameTarget);
      openDirectGameModal();
      sessionStorage.removeItem('directGame');
    }

  });

  useEffect(() => {
    if (connected && MyID) {
      socket.emit('Con', MyID);
    }
    socket.emit('GameList');
  }, [connected, MyID]);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('match_failed', () => {
      setMatchFailed(true);
    });

    socket.on('matched', (e: MatchData) => {
      aname = e.a;
      bname = e.b;
      dr = e.dr;
      sbool = e.speed;
      lbool = e.ladder;
      setMatched(true);
      setGameListModalState(false);
    });

    socket.on('finish', (e: number) => {
      name = e === 0 ? aname : bname;
      setMatched(false);
      setGameResult(true);
    });

    socket.on('gameList', (e: GameNode[]) => {
      setGameList(e);
      if (loada) setloada(false);
      else setloada(true);
    });
  }, [loada]);

  const onMathCancel = () => {
    if (!matched) {
      socket.emit('Cancel');
    }
  };

  //game list modal
  const [GameListModalState, setGameListModalState] = useState(false);
  const openGameListModal = () => {
    setGameListModalState(true);
  };
  const closeGameListModal = () => {
    onMathCancel();
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

  //gameresult modal
  const closeGameResult = () => setGameResult(false);
  //direct game modal
  const [DirectGameModalState, setDirectGameModalState] = useState(false);
  const openDirectGameModal = () => {
    setDirectGameModalState(true);
  };
  const closeDirectGameModal = () => {
    setDirectGameModalState(false);
  };
  //match failed modal
  const closeMatchFailedModal = () => {
    setMatchFailed(false);
    if (GameListModalState) closeGameListModal();
  };

  return matched ? (
    <div id="App-Container">
      <span className="App-Left">
        <Game a={aname} b={bname} dr={dr} speed={sbool} ladder={lbool} />
      </span>
      <span className="App-Right">
        <SideBar />
      </span>
      <MatchFailedModal open={MatchFailed} close={closeMatchFailedModal} />
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
      <GameResult name={name} open={gameResult} close={closeGameResult} />
      <DirectGameModal
        open={DirectGameModalState}
        close={closeDirectGameModal}
        targetID={DirectGameTarget}
        closeUserInfoModal={null}
      />
      <MatchFailedModal open={MatchFailed} close={closeMatchFailedModal} />
    </div>
  );
};

export default Lobby;
