import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import Loading from "./Loading";

//const socket = socketIOClient("localhost:5000");

interface chatObj{
	roomName: string,
	userName: string
}

const Chat = ({ roomName, userName }: chatObj) => {
  const myInfo = {
    roomName: roomName ? roomName : localStorage.getItem("roomName"),
    userName: userName ? userName : localStorage.getItem("userName"),
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
          <ChatLog socket={currentSocket}></ChatLog>
          <ChatInput userName={userName} socket={currentSocket}></ChatInput>
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Chat;
