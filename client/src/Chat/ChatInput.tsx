import React, { useRef, useState } from "react";
import "./styles/ChatInput.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button} from "react-bootstrap";

const socketIOClient = require('socket.io-client')


const ChatInput = ({ userName, socket }: any) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    socket.emit("onSend", {
      userName: userName ? userName : sessionStorage.getItem("userName"),
      msg: chatMessage,
      timeStamp: new Date().toLocaleTimeString(),
    });
    setChatMessage("");
  };

  const onChatMessageChange = (e:any) => {
    setChatMessage(e.target.value);
  };

  return (
    <div>
      <form className="ChatInput-form" onSubmit={handleSubmit}>
        <input type="text" className="form-control"
          placeholder="메시지를 입력하세요."
          value={chatMessage}
          onChange={onChatMessageChange}
        ></input>
        <Button type="button" className="btn btn-warning btn-sm">전송</Button>
      </form>
    </div>
  );
};

export default ChatInput;