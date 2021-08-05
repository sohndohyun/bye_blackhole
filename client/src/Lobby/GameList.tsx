import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useSwr from 'swr';
import speed from '../Images/speed.png';
import './styles/GameList.scss';
import { GameNode } from './IGameNode';
import socket from '../Pong/PongSocket';

const GameList = (prop: { gameList: GameNode[] }) => {
  const { gameList } = prop;
  
  const observe = (id: number) => {
    socket.emit('Observe', id);
  };

  return (
    <>
      {gameList?.map((gameRoom) => (
        <button
          type="button"
          className="GameList"
          onClick={() => {
            observe(gameRoom.id);
          }}
        >
          <span className="GameList-left">
            <div
              className={
                gameRoom.ladder ? 'GameList-icon ladder' : 'GameList-icon'
              }
            >
              {gameRoom.speed ? (
                <img src={speed} width="30" height="30" />
              ) : (
                'N'
              )}
            </div>
          </span>
          <span className="GameList-right">
            <div className="player">{gameRoom.a}</div>
            <div>vs</div>
            <div className="player">{gameRoom.b}</div>
          </span>
        </button>
      ))}
    </>
  );
};

export default GameList;
