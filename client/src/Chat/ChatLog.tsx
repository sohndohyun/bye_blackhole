import React, { useEffect, useState } from "react";
import "./styles/ChatLog.css";


const ChatLog = ({ userName, socket }: any) => {
  const [msgList, setMsgList] = useState<any[]>([]);

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
		  	{msg.userName &&
          		<div className="msg-userName">{msg.userName}</div>
			}
			{msg.msg &&
				<div className="msgLeft">
          			<span className="msg-msg">{msg.msg}</span>
					<span className="msg-timeStamp">({msg.timeStamp})</span>
				</div>
			}
			{msg.myMsg &&
				<div className="msgRight">
					<span className="msg-timeStamp">({msg.timeStamp})</span>
          			<span className="msg-msg">{msg.myMsg}</span>
				</div>
			}
		  <div className="sysMsg" >{msg.sysMsg}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatLog;