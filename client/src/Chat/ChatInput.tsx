import React, { useEffect, useRef, useState } from "react";
import "./styles/ChatInput.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button} from "react-bootstrap";

const ChatInput = ({socket, MyPermission}: any) => {
	const [chatMessage, setChatMessage] = useState("");
	const [MyID, setMyID] = useState('')
	const [roomName, setRoomName] = useState('')

	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (room) setRoomName(room)
	})

	const handleSubmit = (e:any) => {
		e.preventDefault();
		if (MyPermission !== 'muted')
		{
			socket.emit("onSend", {
				title: roomName,
				nickname: MyID,
				msg: chatMessage,
				date: new Date().toLocaleTimeString(),
			});
			setChatMessage("");
		}
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
		{MyPermission === 'muted' ? null
        	: <Button type="button" className="btn btn-sm" onClick={handleSubmit}>send</Button>
  		}
      </form>
    </div>
  );
};

export default ChatInput;