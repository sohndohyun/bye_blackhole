import React, { useEffect, useState } from "react";
import "./styles/ChatLog.scss";
import images from '../images/Images'


const ChatLog = ({ userName, socket }: any) => {
	const [msgList, setMsgList] = useState<any[]>([{userName:'jinkim', icon:'gamer_boy', msg:'hello', timeStamp:'2021-01-01 00:00'}, {myMsg:'mymsgworlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {sysMsg:'sysMsg님이 입장했습니다'},{userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {myMsg:'mymsg', timeStamp:'2021-01-01 00:00'},{myMsg:'mymsgworlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}, {userName:'2222', icon:'gamer_girl',msg:'worlddddddddddddddddddddddddddddddddddddddasdfasdfasdfasdf', timeStamp:'2021-01-01 00:00'}]);

	useEffect(() => {
		// messsgeItem : {msg: String, name: String, timeStamp: String}
		socket.on("onReceive", (messageItem: {userName:string, msg:string, timeStamp:string}) => {
			userName = userName ? userName : sessionStorage.getItem("userName")
			if (userName === messageItem.userName)
				setMsgList((msgList) => [...msgList, {myMsg: messageItem.msg, timeStamp: messageItem.timeStamp} as never]);
			else
				setMsgList((msgList) => [...msgList, messageItem]);
			console.log(messageItem);
			console.log(userName)
		});
		socket.on("onConnect", (systemMessage: string) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);
		});
		socket.on("onDisconnect", (systemMessage: any) => {
			setMsgList((msgList) => [...msgList, { sysMsg: systemMessage } as never]);
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
					<span><img src={images(msg.icon)}  width="30" height="30" className="msg-icon"/></span>
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