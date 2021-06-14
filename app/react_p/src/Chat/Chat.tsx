import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import Loading from "./Loading";
import UserList from "./UserList";
import "./styles/Chat.css"

interface chatObj{
	roomName: any,
	userName: any,
	icon: any
}

const Chat = ({ roomName, userName, icon }: chatObj) => {
  const myInfo = {
    roomName: roomName ? roomName : sessionStorage.getItem("roomName"),
    userName: userName ? userName : sessionStorage.getItem("userName"),
	icon: icon ? icon : sessionStorage.getItem("icon"),
  };

  const [currentSocket, setCurrentSocket] = useState(socketIOClient());

  useEffect(() => {
    setCurrentSocket(socketIOClient("http://localhost:80"));
  }, []);

  if (currentSocket) {
    currentSocket.on("connect", () => {
      currentSocket.emit("join", myInfo);
    });
  }


  return (
    <div>
      {currentSocket ? (
        <>
		  <div id="Chat-container">
		  	<span className="Chat-box ChatLog">
          		<div className="ChatLog-top">
					<ChatLog userName={userName} socket={currentSocket}></ChatLog>
				</div>
				<div className="ChatInput">
          			<ChatInput userName={userName} socket={currentSocket}></ChatInput>
		  		</div>
		  	</span>
		  	<span className="Chat-box UserList">
		  		<UserList socket={currentSocket}></UserList>
		  	</span>
		  </div>

        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Chat;
