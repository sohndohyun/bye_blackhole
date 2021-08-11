import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './styles/Modal.scss';

const ChatListModal = (props: any) => {
  const { open, close, MyID } = props;

  const [NewRoomName, setNewRoomName] = useState('');
  const [RoomPWD, setRoomPWD] = useState('');
  const [IsProtectedRoom, setIsProtectedRoom] = useState(false);
  const [IsUniqueName, setIsUniqueName] = useState(true);

  const handleRoomNameChange = useCallback((e: any) => {
    setNewRoomName(e.target.value);
  }, []);
  const handelRoomPWD = useCallback((e: any) => {
    setRoomPWD(e.target.value);
  }, []);

  const ProtectedRoomCheckHandler = useCallback(
    (e: any) => {
      setRoomPWD('');
      setIsProtectedRoom(!IsProtectedRoom);
    },
    [IsProtectedRoom],
  );

  async function makeNewChat() {
    if (RoomPWD === '') var security = 'public';
    else var security = 'protected';
    await axios
      .post('/Lobby/chatCreate', {
        title: NewRoomName,
        password: RoomPWD,
        owner_id: MyID,
        security: security,
      })
      .then((res) => {
        document.location.href = '/chat';
        sessionStorage.setItem('roomName', NewRoomName);
      })
      .catch((err) => {
        setIsUniqueName(false);
      });
  }

  return (
    <div className={open ? 'openModal Modal' : 'Modal'}>
      {open ? (
        <section>
          <header>
            New Chatting Room
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <main>
            <label>
              <b>Room Name:&nbsp;</b>
              <input onChange={handleRoomNameChange} maxLength={20}></input>
            </label>
            <label>
              &nbsp;&nbsp;
              <input
                type="checkbox"
                checked={IsProtectedRoom}
                onChange={(e) => ProtectedRoomCheckHandler(e)}
              ></input>{' '}
              protected
            </label>
            {IsUniqueName ? null : (
              <label className="error">유효하지 않은 값입니다.</label>
            )}
            {IsProtectedRoom ? (
              <div className="checkbox-pwd">
                <b>password:&nbsp;</b>
                <input type="password" onChange={handelRoomPWD}></input>
              </div>
            ) : null}
          </main>
          <footer>
            <a className="btn btn-primary" onClick={makeNewChat}>
              <b>Enter</b>
            </a>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default ChatListModal;
