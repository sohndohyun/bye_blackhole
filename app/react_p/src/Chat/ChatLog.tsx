import React, { useEffect, useState } from "react";

const ChatLog = ({ socket }: any) => {
  const [msgList, setMsgList] = useState<any[]>([]);

  useEffect(() => {
	console.log('컴포넌트가 화면에 나타남');
	// messsgeItem : {msg: String, name: String, timeStamp: String}
    socket.on("onReceive", (messageItem: never) => {
      setMsgList((msgList) => [...msgList, messageItem]);
      console.log(messageItem);
    });
    socket.on("onConnect", (systemMessage: any) => {
      setMsgList((msgList) => [...msgList, { msg: systemMessage } as never]);
    });
    socket.on("onDisconnect", (systemMessage: any) => {
      setMsgList((msgList) => [...msgList, { msg: systemMessage } as never]);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      {msgList.map((msg, idx) => (
        <div key={idx}>
          <div>{msg.userName}</div>
          <div>{msg.timeStamp}</div>
          <div>{msg.msg}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatLog;