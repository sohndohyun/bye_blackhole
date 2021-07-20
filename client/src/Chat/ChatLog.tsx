import React, { useEffect, useState } from "react";
import "./styles/ChatLog.scss";
import {findImg} from '../Images/Images'
import axios from "axios";

const ChatLog = ({socket}: any) => {
	const [msgList, setMsgList] = useState<any[]>([])
	const [MyID, setMyID] = useState('')
	const [roomName, setRoomName] = useState('')

	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (room) setRoomName(room)
	})

	useEffect(() => {
		if (MyID && roomName)
		{
		socket.on("onReceive", async(messageItem: {nickname:string, msg:string, date:string, icon:string}) => {
			if (MyID === messageItem.nickname)
				setMsgList((msgList) => [...msgList, {myMsg: messageItem.msg, date: messageItem.date} as never]);
			else
				setMsgList((msgList) => [...msgList, messageItem]);
		});

		/*
		socket.on("onConnect", async (systemMessage: string) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);
		});
		socket.on("onDisconnect", async(systemMessage: any) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);
		});
		*/
		return () => {
			socket.disconnect();
		};
	}
	}, [socket]);

	return (
	<div>
		{msgList.map((msg, idx) => (
		<div key={idx}>
			{msg.msg &&
				<div className="msgLeft">
					<span><img src={findImg(msg.icon)}  width="30" height="30" className="msg-icon"/></span>
					<span>
						{msg.nickname && <div className="msg-userName">{msg.nickname}</div>}
						<div className="msg-left">{msg.msg}</div>
					</span>
					<span className="msg-timeStamp">({msg.date})</span>
				</div>
			}
			{msg.myMsg &&
				<div className="msgRight">
					<span className="msg-right">{msg.myMsg}</span>
					<span className="msg-timeStamp">({msg.date})</span>
				</div>
			}
			<div className="sysMsg" >{msg.sysMsg}</div>
		</div>
		))}
	</div>
	);
};

export default ChatLog;