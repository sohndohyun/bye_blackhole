import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import Loading from "./Loading";
import UserList from "./UserList";
import SideBar from "../SideBar/SideBar";
import "./styles/Chat.scss"
import setting from '../Images/setting.png'
import ChatSettingModal from "./ChatSettingModal";
import axios from "axios";
import useSwr from 'swr';
const socketIOClient = require('socket.io-client')

const Chat = () => {
	
	interface Iuser{
		id:string,
		permission:string,
		icon:string
	}
	const currentSocket = socketIOClient('http://localhost:8080')
	const [MyID, setMyID] = useState('')
	const [roomName, setRoomName] = useState('')
	const [MyPermission, setMyPermission] = useState('')

	const fetcher = async (url:string) => {
		if (roomName)
		{
			const res = await axios.get(url)
			res.data.users = userSorting(res.data.users)
			return res.data;
		}
	}
	const {data, error, mutate} = useSwr<{num:string, security: string, users:Iuser[]}>('/Chat/info?title=' + roomName, fetcher)

	function userSorting(userList:Iuser[])
	{
		var rtn: Iuser[] = []
		var admin: Iuser[] = []
		var user: Iuser[] = []

		for(let i = 0; i < userList.length; i++)
		{
			if (userList[i].id === MyID)
				setMyPermission(userList[i].permission)
			
			if (userList[i].permission === 'owner')
				rtn.push(userList[i])
			else if (userList[i].permission === 'admin')
				admin.push(userList[i])
			else
				user.push(userList[i])
		}
		
		admin.forEach(ele => rtn.push(ele))
		user.forEach(ele => rtn.push(ele))
		return rtn
	}

	useEffect(() => {
		//setCurrentSocket(socketIOClient());
		
		const id = sessionStorage.getItem('nickname')
		const room = sessionStorage.getItem('roomName')
		if (id) setMyID(id)
		if (room) setRoomName(room)
	});
	
	const myInfo = {
		roomName: roomName,
		userName: MyID,
	};

	if (currentSocket) {
		currentSocket.on("connect", () => {
			currentSocket.emit("join", myInfo);
		});
	}

	

	//chat owner modal
	const [ChatSettingModalState, setChatSettingModalState] = useState(false);
	const openChatSettingModal = () => {
		setChatSettingModalState(true);
	}
	const closeChatSettingModal = () => {
		setChatSettingModalState(false);
	}

	return (
	<div id="App-Container">
		{currentSocket ? (
		<>
		<span className="App-Left">
			<div id="chat-container">
			<div className="chat-top">
				<span className="RoomInfo-num">{data?.num}</span>
				<span>{roomName}</span>
				{MyPermission !== 'user' ? 
					<button className="setting-btn" onClick={openChatSettingModal}>
						<img src={setting} width="30" height="30"></img>
					</button>
					: null
				}
			</div>
			<ChatSettingModal open={ChatSettingModalState} close={closeChatSettingModal} chatRoomID={roomName} MyPermission={MyPermission}></ChatSettingModal>
			<div className="chat-bottom">
				<span className="left-chatLog">
					<div className="chatLog-top">
						<ChatLog socket={currentSocket} MyID={MyID} roomName={roomName}/>
					</div>
					<div className="chatLog-bottom">
						<ChatInput socket={currentSocket}/>
					</div>
				</span>
				<span className="right-chatUser">
					<UserList socket={currentSocket} users={data?.users} MyPermission={MyPermission} getRoomInfoMutate={mutate} roomName={roomName}></UserList>
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
