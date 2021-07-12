import React, { useEffect, useState } from "react";
import "./styles/ChatLog.scss";
import {findImg} from '../Images/Images'
import axios from "axios";

const ChatLog = ({socket}: any) => {
	const [msgList, setMsgList] = useState<any[]>([{userName:'jinkim', icon:'gamer_boy', msg:'hello', timeStamp:'2021-01-01 00:00'}, {myMsg:'mymsgworlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {sysMsg:'sysMsg님이 입장했습니다'},{userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {myMsg:'mymsg', timeStamp:'2021-01-01 00:00'},{myMsg:'mymsgworlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}]);

	const [MyID, setMyID] = useState('')
	const [roomName, setRoomName] = useState('')
	
	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (room) setRoomName(room)


		socket.on("onReceive", async(messageItem: {userName:string, msg:string, timeStamp:string}) => {
			if (MyID === messageItem.userName)
				setMsgList((msgList) => [...msgList, {myMsg: messageItem.msg, timeStamp: messageItem.timeStamp} as never]);
			else
				setMsgList((msgList) => [...msgList, messageItem]);

			await axios.post('/chat/' + roomName, {id:messageItem.userName, timeStamp:messageItem.timeStamp, content:messageItem.msg})
			
		});
		socket.on("onConnect", async (systemMessage: string) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);
			
			await axios.post('/chat/' + roomName, {sysMsg: systemMessage})
		});
		socket.on("onDisconnect", async(systemMessage: any) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);

			await axios.post('/chat/' + roomName, {sysMsg: systemMessage})
		});
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return (
	<div>
		{msgList.map((msg, idx) => (
		<div key={idx}>
			{msg.msg &&
				<div className="msgLeft">
					<span><img src={findImg(msg.icon)}  width="30" height="30" className="msg-icon"/></span>
					<span>
						{msg.userName && <div className="msg-userName">{msg.userName}</div>}
						<div className="msg-left">{msg.msg}</div>
					</span>
					<span className="msg-timeStamp">({msg.timeStamp})</span>
				</div>
			}
			{msg.myMsg &&
				<div className="msgRight">
					<span className="msg-right">{msg.myMsg}</span>
					<span className="msg-timeStamp">({msg.timeStamp})</span>
				</div>
			}
			<div className="sysMsg" >{msg.sysMsg}</div>
		</div>
		))}
	</div>
	);
};

export default ChatLog;