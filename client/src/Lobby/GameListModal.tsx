import React, { useState, useCallback } from 'react';
import './styles/Modal.scss';
import socket from '../Pong/PongSocket';

const GameListModal = (props: any) => {
  const { open, connected, close, MyID } = props;
  const [IsSpeed, setIsSpeed] = useState(false);
  const [Matching, setMatching] = useState(false);

  const modeHandler = useCallback((e: any) => {
    if (e.target.value === 'speed') setIsSpeed(true);
    else setIsSpeed(false);
  }, []);

  function makeNewGame() {
    if (connected) {
      socket.emit(`Join`, {name:MyID, speed:IsSpeed, ladder: true});
      setMatching(true);
    }
  }

  socket.on("cancel", () => {
	setMatching(false);
  });

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
          {Matching ? (
            <main>Matching...</main>
          ) : (
            <>
              {' '}
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
                <a className="btn btn-primary" onClick={makeNewGame}>
                  <b>Matching Start</b>
                </a>
              </footer>
            </>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default GameListModal;
