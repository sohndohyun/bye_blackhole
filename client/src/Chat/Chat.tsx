import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import Loading from "./Loading";
import UserList from "./UserList";
import RightList from "../Lobby/RightList";
import "./styles/Chat.scss"
import setting from '../Images/setting.png'
import ChatOwnerModal from "./ChatOwnerModal";

const socketIOClient = require('socket.io-client')

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
		setCurrentSocket(socketIOClient("http://localhost:8080"));
	}, []);

	if (currentSocket) {
		currentSocket.on("connect", () => {
			currentSocket.emit("join", myInfo);
		});
	}

	const [RoomInfo, setRoomInfo] = useState<{id:string, num:number, owner_id:string, pwd:string}>({id:'room1', num:7, owner_id:'jinkim', pwd:'asdf'})

	//chat owner modal
	const [ChatOwnerModalState, setChatOwnerModalState] = useState(false);
	const openChatOwnerModal = () => {
		setChatOwnerModalState(true);
	}
	const closeChatOwnerModal = () => {
		setChatOwnerModalState(false);
	}

	return (
	<div id="App-Container">
		{currentSocket ? (
		<>
		<span className="App-Left">
			<div id="chat-container">
			<div className="chat-top">
				<span className="RoomInfo-num">{RoomInfo.num}</span>
				<span>{RoomInfo.id}</span>
				{'jinkim' === RoomInfo.owner_id ? 
					<button className="setting-btn" onClick={openChatOwnerModal}>
						<img src={setting} width="30" height="30"></img>
					</button>
					: null
				}
			</div>
			<ChatOwnerModal open={ChatOwnerModalState} close={closeChatOwnerModal} chatRoomID={RoomInfo.id}pwd={RoomInfo.pwd}></ChatOwnerModal>
			<div className="chat-bottom">
				<span className="left-chatLog">
					<div className="chatLog-top">
						<ChatLog userName={userName} socket={currentSocket}></ChatLog>
					</div>
					<div className="chatLog-bottom">
						<ChatInput userName={userName} socket={currentSocket}></ChatInput>
					</div>
				</span>
				<span className="right-chatUser">
					<UserList socket={currentSocket}></UserList>
				</span>
			</div>
			</div>
		</span>
		<span className="App-Right">
				<RightList />
		</span>
		</>
		) : (
		  <Loading></Loading>
		)}
	</div>
  );
};

export default Chat;
