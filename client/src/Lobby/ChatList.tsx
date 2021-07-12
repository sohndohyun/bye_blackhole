import {useEffect, useState, useCallback} from "react";
import axios from "axios";
import useSwr from 'swr';
import lock from '../Images/lock.png'
import unlock from '../Images/unlock.png'
import "./styles/ChatList.scss"

const ChatList = () => {
	const fetcher = async (url:string) => {
		const res = await axios.get(url)
		return res.data;
	}

	const {data, error} = useSwr<{title:string, num:number, security:string}[]>('Lobby/chatList', fetcher)

	return (
	<>
	{data?.map(chatRoom=>
		<button type="button" className="chatList" onClick={() => {
			document.location.href = '/Chat';
			sessionStorage.setItem('roomName', chatRoom.title)
		}}>
			<span className="chatList-left">
				<div className="chatList-num">{chatRoom.num}</div>
			</span>
			<span className="lock">
				{chatRoom.security != "protected" ? <img src={unlock} width="20" height="20"/> : <img src={lock} width="20" height="20"/>}
			</span>
			<span className="roomName">
				{chatRoom.title}
			</span>
		</button>
	)}
	</>
	)
}

export default ChatList