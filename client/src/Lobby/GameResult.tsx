import React, { useState, useCallback } from 'react';
import './styles/Modal.scss';
import socket from '../Pong/PongSocket';

const GameResult = (props: any) => {
  const { open, name, close } = props;

  return (
    <div className={open ? 'openModal Modal' : 'Modal'}>
      {open ? (
        <section>
          <header>
            Game Result
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <>
            {' '}
            <main>
              <b>{name} win</b>
            </main>
          </>
        </section>
      ) : null}
    </div>
  );
};
export default GameResult;
