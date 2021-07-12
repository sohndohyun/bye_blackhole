import React, { useEffect, useRef, useState } from "react";
import "./styles/ChatInput.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button} from "react-bootstrap";

const ChatInput = ({socket}: any) => {
	const [chatMessage, setChatMessage] = useState("");
	const [MyID, setMyID] = useState('')

	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		if (id) setMyID(id)
	})

	const handleSubmit = (e:any) => {
		e.preventDefault();
		socket.emit("onSend", {
			userName: MyID,
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
          placeholder="Enter message"
          value={chatMessage}
          onChange={onChatMessageChange}
        ></input>
        <Button type="button" className="btn btn-sm">send</Button>
      </form>
    </div>
  );
};

export default ChatInput;