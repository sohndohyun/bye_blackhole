import React, { useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import "./ChatInput.css";

interface chatObj {
	userName:any,
	socket:any
}

const ChatInput = ({ userName, socket }: chatObj) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    socket.emit("onSend", {
      userName: userName ? userName : localStorage.getItem("userName"),
      msg: chatMessage,
      timeStamp: new Date().toLocaleTimeString(),
    });
    setChatMessage("");
  };

  const onChatMessageChange = (e:any) => {
    setChatMessage(e.target.value);
  };

  return (
    <div className="ChatInput-container">
      <form className="ChatInput-form" onSubmit={handleSubmit}>
        <input
          placeholder="메시지를 입력하세요."
          value={chatMessage}
          onChange={onChatMessageChange}
        ></input>
        <button>전송</button>
      </form>
    </div>
  );
};

export default ChatInput;