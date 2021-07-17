import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import Loading from "./Loading";
import UserList from "./UserList";
import SideBar from "../SideBar/SideBar";
import "./styles/Chat.scss"
import setting from '../Images/setting.png'
import ChatOwnerModal from "./ChatOwnerModal";
import axios from "axios";
import useSwr from 'swr';
const socketIOClient = require('socket.io-client')

const Chat = () => {
	
	const [currentSocket, setCurrentSocket] = useState(socketIOClient());
	const [MyID, setMyID] = useState('')
	const [MyIcon, setMyIcon] = useState('')
	const [roomName, setRoomName] = useState('')

	const fetcher = async (url:string) => {
		const res = await axios.get(url)
		return res.data;
	}
	const {data, error} = useSwr<{room_id:string, room_num:string, room_owner: string}>('/Chat/' + roomName, fetcher)

	useEffect(() => {
		setCurrentSocket(socketIOClient("http://localhost:8080"));
		
		const id = sessionStorage.getItem('nickname')
		const icon = sessionStorage.getItem('icon')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (icon) setMyIcon(icon)
		if (room) setRoomName(room)
		
	});
	
	const myInfo = {
		roomName: roomName,
		userName: MyID,
		icon: MyIcon,
	};

	if (currentSocket) {
		currentSocket.on("connect", () => {
			currentSocket.emit("join", myInfo);
		});
	}

	

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
				<span className="RoomInfo-num">{data?.room_num}</span>
				<span>{data?.room_id}</span>
				{MyID === data?.room_owner ? 
					<button className="setting-btn" onClick={openChatOwnerModal}>
						<img src={setting} width="30" height="30"></img>
					</button>
					: null
				}
			</div>
			<ChatOwnerModal open={ChatOwnerModalState} close={closeChatOwnerModal} chatRoomID={data?.room_id}></ChatOwnerModal>
			<div className="chat-bottom">
				<span className="left-chatLog">
					<div className="chatLog-top">
						<ChatLog socket={currentSocket}/>
					</div>
					<div className="chatLog-bottom">
						<ChatInput socket={currentSocket}/>
					</div>
				</span>
				<span className="right-chatUser">
					<UserList socket={currentSocket}></UserList>
				</span>
			</div>
			</div>
		</span>
		<span className="App-Right">
				<SideBar />
		</span>
		</>
		) : (
		  <Loading></Loading>
		)}
	</div>
  );
};

export default Chat;
