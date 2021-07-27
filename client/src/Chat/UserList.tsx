import React, { useCallback, useEffect, useState } from "react";
import "./styles/UserList.scss"
import {findImg} from '../Images/Images'
import crown from '../Images/crown.png'
import UserListModal from './UserListModal'
import axios from "axios";
import { mutate } from "swr";

interface IUserList{
	socket:any,
	users: {id:string, permission:string, icon:string}[] | undefined,
	MyPermission: string,
	getRoomInfoMutate: any,
	roomName:string
}

const UserList = ({ users, MyPermission, getRoomInfoMutate, roomName } : IUserList) => {
	//UserListModal
	const [chatUser, setChatUser] = useState('')
	const [UserListModalState, setUserListModalState] = useState(false);
	const openUserListModal = (id:string) => {
		setUserListModalState(true);
		setChatUser(id);
	}
	const closeUserListModal = () => {
		setUserListModalState(false);
	}

	//owner button
	async function plusBtn(id:string){
		const rtn = await axios.get('chat/admin?title=' + roomName + '&id=' + id)
		getRoomInfoMutate()
	}
	async function minusBtn(id:string){
		const rtn = await axios.delete('chat/admin?title=' + roomName + '&id=' + id)
		getRoomInfoMutate()
	}

	return (
		<div className="userList-container">
			{users?.map(user=>
			<div className="userList-box">
				<button className="userList-btn" onClick={() => 
					(MyPermission === 'owner' || MyPermission === 'admin') && 
					(user.permission === 'user' || user.permission === 'muted') ? openUserListModal(user.id): null}>
					<span className="iconBox">
						<span><img src={findImg(user.icon)} width="30" height="30" className="icon"/></span>
						<span>{(user.permission === 'owner' || user.permission === 'admin') ?
							<img src={crown} width="20" height="20" className={user.permission === 'owner' ? 'crown owner' : 'crown admin'}/>
							: null
						}</span>
					</span>
					<span className='id'>{user.id}</span>
				</button>
				<span>{MyPermission === 'owner' && (user.permission === 'user' || user.permission === 'muted') ?
					<button className="owner-plusBtn" onClick={() => plusBtn(user.id)}>+</button>
					: null
				}</span>
				<span>{MyPermission === 'owner' && user.permission === 'admin' ?
					<button className="owner-xBtn" onClick={() => minusBtn(user.id)}>x</button>
					: null
				}</span>
			</div>
			)}
			<UserListModal open={UserListModalState} close={closeUserListModal} targetID={chatUser} roomName={roomName} getRoomInfoMutate={getRoomInfoMutate}></UserListModal>
		</div>

	);
  };
  export default UserList;
