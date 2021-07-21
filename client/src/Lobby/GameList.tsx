import {useEffect, useState, useCallback} from "react";
import axios from "axios";
import useSwr from 'swr';
import speed from '../Images/speed.png'
import "./styles/GameList.scss"

const GameList = () => {
	const fetcher = async (url:string) => {
		const res = await axios.get(url)
		return res.data;
	}

	const {data, error} = useSwr<{p1:string, p2:string, speed:boolean, ladder:boolean}[]>('Lobby/gameList', fetcher)

	return (
	<>
	{data?.map(gameRoom=>
		<button type="button" className="GameList">
			<span className="GameList-left">
				<div className={gameRoom.ladder ? "GameList-icon ladder" : "GameList-icon"}>
					{gameRoom.speed ? <img src={speed} width="30" height="30"/> : 'N'}
				</div>
			</span>
			<span className="GameList-right">
				<div className="player">{gameRoom.p1}</div>
				<div>vs</div>
				<div className="player">{gameRoom.p2}</div>
			</span>
		</button>
	)}
	</>
	)
}

export default GameList