import React, { useState, useCallback } from 'react';
import '../Lobby/styles/Modal.scss';
import socket from '../Pong/PongSocket';

const DirectGameModal = (props: any) => {
  const { open, close, targetID, closeUserInfoModal } = props;
  const [IsSpeed, setIsSpeed] = useState(false);

  const modeHandler = useCallback((e: any) => {
    if (e.target.value === 'speed') setIsSpeed(true);
    else setIsSpeed(false);
  }, []);

  function makeDirectGame() {
	socket.emit('MatchWith', {name: targetID, speed: IsSpeed});
	close()
	closeUserInfoModal()
  }

  return (
    <div className={open ? 'openModal Modal' : 'Modal'}>
      {open ? (
        <section>
          <header>
            New Game
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <main>
            <span>
              <input
                type="radio"
                name="speed"
                value="normal"
                onClick={modeHandler}
              />{' '}
              normal &nbsp;&nbsp;
            </span>
            <span>
              <input
                type="radio"
                name="speed"
                value="speed"
                onClick={modeHandler}
              />{' '}
              speed{' '}
            </span>
          </main>
          <footer>
            <a className="btn btn-primary" onClick={makeDirectGame}>
              <b>Game Start</b>
            </a>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default DirectGameModal;
