import React, { useEffect, useState } from "react";
import "./styles/ChatLog.scss";
import {findImg} from '../Images/Images'
import axios from "axios";
import useSwr from 'swr';

const ChatLog = ({socket}: any) => {
	const [MyID, setMyID] = useState('')
	const [roomName, setRoomName] = useState('')

	const fetcher = async (url:string) => {
		if (roomName)
		{
			let res = await axios.get(url)

			const block = await axios.get('profile/allblock?myID=' + MyID)
			let chatlog: {id:string, date:Date, content:string, icon:string, sysMsg:boolean}[] = []
			for(let i = 0; i < res.data.length; i++)
			{
				const idx = block.data.blocklist.indexOf(res.data[i].id)
				if (idx <= -1)
					chatlog.push(res.data[i])
			}
			res.data = chatlog
			return res.data;
		}
	}
	const {data, error, mutate} = useSwr<{id:string, date:Date, content:string, icon:string, sysMsg:boolean}[]>('/chat/chatLog?title=' + roomName, fetcher)

	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (room) setRoomName(room)
	})

	useEffect(() => {
		socket.on("onReceive", async(messageItem: {nickname:string, msg:string, date:string, icon:string}) => {
			mutate()
		});
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return (
	<div>
		{data?.map((msg, idx) => (
		<div key={idx}>
			{msg.sysMsg ? <div className="sysMsg" >{msg.id}{msg.content}</div>
				: msg.id === MyID ?
					<div className="msgRight">
						<span className="msg-right">{msg.content}</span>
						<span className="msg-timeStamp">({msg.date})</span>
					</div>
					: 
					<div className="msgLeft">
						<span><img src={findImg(msg.icon)}  width="30" height="30" className="msg-icon"/></span>
						<span>
							{msg.id && <div className="msg-userName">{msg.id}</div>}
							<div className="msg-left">{msg.content}</div>
						</span>
						<span className="msg-timeStamp">({msg.date})</span>
					</div>
			}
		</div>
		))}
	</div>
	);
};

export default ChatLog;