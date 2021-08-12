import React, { useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import ChatLog from './ChatLog';
import Loading from './Loading';
import UserList from './UserList';
import SideBar from '../SideBar/SideBar';
import './styles/Chat.scss';
import setting from '../Images/setting.png';
import ChatSettingModal from './ChatSettingModal';
import axios from 'axios';
import useSwr from 'swr';

import Game from '../Pong/Game';
import socket from '../Pong/PongSocket';
import GameResult from '../Lobby/GameResult';
import { MatchData } from '../Lobby/Lobby';
import MatchFailedModal from '../Lobby/MatchFailedModal';
import DirectGameModal from '../SideBar/DirectGameModal';

const socketIOClient = require('socket.io-client');

let aname = 'a';
let bname = 'b';
let dr = 0;
let sbool = false;
let lbool = false;
let name: string;

const Chat = () => {
  interface Iuser {
    id: string;
    permission: string;
    icon: string;
  }
  const currentSocket = socketIOClient('http://localhost:8080');
  const [MyID, setMyID] = useState('');
  const [roomName, setRoomName] = useState('');
  const [MyPermission, setMyPermission] = useState('');

  const fetcher = async (url: string) => {
    if (roomName) {
      const res = await axios.get(url);
      res.data.users = userSorting(res.data.users);
      return res.data;
    }
  };
  const { data, error, mutate } = useSwr<{
    num: string;
    security: string;
    users: Iuser[];
  }>('/Chat/info?title=' + roomName, fetcher);

  function userSorting(userList: Iuser[]) {
    var rtn: Iuser[] = [];
    var admin: Iuser[] = [];
    var user: Iuser[] = [];

    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === MyID) setMyPermission(userList[i].permission);

      if (userList[i].permission === 'owner') rtn.push(userList[i]);
      else if (userList[i].permission === 'admin') admin.push(userList[i]);
      else user.push(userList[i]);
    }

    admin.forEach((ele) => rtn.push(ele));
    user.forEach((ele) => rtn.push(ele));
    return rtn;
  }

  useEffect(() => {
    //setCurrentSocket(socketIOClient());

    const id = sessionStorage.getItem('nickname');
    const room = sessionStorage.getItem('roomName');
    if (id) setMyID(id);
    if (room) setRoomName(room);

    const gameTarget = sessionStorage.getItem('directGame');
    if (gameTarget) {
      setDirectGameTarget(gameTarget);
      openDirectGameModal();
      sessionStorage.removeItem('directGame');
    }
  });

  const [connected, setConnected] = useState(false);
  const [matched, setMatched] = useState(false);
  const [MatchFailed, setMatchFailed] = useState(false);
  const [DirectGameTarget, setDirectGameTarget] = useState('');
  const [gameResult, setGameResult] = useState(false);

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
    });

    socket.on('finish', (e: number) => {
      name = e === 0 ? aname : bname;
      setMatched(false);
      setGameResult(true);
    });
  });

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
    if (DirectGameModalState) closeDirectGameModal();
  };

  const myInfo = {
    roomName: roomName,
    userName: MyID,
  };

  if (currentSocket) {
    currentSocket.on('connect', () => {
      currentSocket.emit('join', myInfo);
    });
  }

  //chat owner modal
  const [ChatSettingModalState, setChatSettingModalState] = useState(false);
  const openChatSettingModal = () => {
    setChatSettingModalState(true);
  };
  const closeChatSettingModal = () => {
    setChatSettingModalState(false);
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
      {currentSocket ? (
        <>
          <span className="App-Left">
            <div id="chat-container">
              <div className="chat-top">
                <span className="RoomInfo-num">{data?.num}</span>
                <span>{roomName}</span>
                {MyPermission === 'owner' || MyPermission === 'admin' ? (
                  <button
                    className="setting-btn"
                    onClick={openChatSettingModal}
                  >
                    <img src={setting} width="30" height="30"></img>
                  </button>
                ) : null}
              </div>
              <ChatSettingModal
                open={ChatSettingModalState}
                close={closeChatSettingModal}
                chatRoomID={roomName}
                MyPermission={MyPermission}
              ></ChatSettingModal>
              <div className="chat-bottom">
                <span className="left-chatLog">
                  <div className="chatLog-top">
                    <ChatLog
                      socket={currentSocket}
                      MyID={MyID}
                      roomName={roomName}
                    />
                  </div>
                  <div className="chatLog-bottom">
                    <ChatInput
                      socket={currentSocket}
                      MyPermission={MyPermission}
                    />
                  </div>
                </span>
                <span className="right-chatUser">
                  <UserList
                    socket={currentSocket}
                    users={data?.users}
                    MyPermission={MyPermission}
                    getRoomInfoMutate={mutate}
                    roomName={roomName}
                  ></UserList>
                </span>
              </div>
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
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Chat;
