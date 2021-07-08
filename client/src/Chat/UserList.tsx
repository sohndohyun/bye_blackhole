import React, { useCallback, useEffect, useState } from "react";
import "./styles/UserList.scss"
import {findImg} from '../Images/Images'
import crown from '../Images/crown.png'
import UserListModal from './UserListModal'
import axios from "axios";

const UserList = ({ socket }: any) => {
	const [userList, setUserList] = useState<{id: string, icon:string, status:string}[]>([{id:'2222', icon:'woman_icon', status:'administrator'}, {id:'3333', icon:'man_icon', status:'none'}, {id:'jinkim', icon:'gamer_boy', status:'owner'}, {id:'2222', icon:'woman_icon', status:'administrator'}, {id:'3333', icon:'man_icon', status:'none'}]);

	const [myInfo, setMyInfo] = useState<{id: string, status:string}>({id:'jinkim', status:'administrator'})

	useEffect(() => {
		socket.on("UserList", (newUser:{id: string, icon:string, status:string}[]) => {
			setUserList(newUser);
			userSorting();
		});

		return () => {
			socket.disconnect();
		};
	}, [socket]);

	function userSorting()
	{
		const owner = userList.find((ele) => {
			if (ele.status === 'owner')
				return true;
		})
		let tmp = [{id:owner?.id, icon: owner?.icon, status:owner?.status}]

		let idx = userList.indexOf(owner as never)
		if (idx > -1) userList.splice(idx, 1)

		userList.forEach((ele) => {
			if (ele.status === 'administrator')
			{
				tmp.push(ele);
				idx = userList.indexOf(ele as never)
				if (idx > -1) userList.splice(idx, 1)
			}
		})

		userList.forEach((ele) => { tmp.push(ele); })
		setUserList(tmp as never);
	}

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
		//const rtn = await axios.get('chat/chatRoomID/admin/plus' + id)
		//setUserList(rtn.data)

	}
	async function minusBtn(id:string){
		//await axios.get('chat/chatRoomID/admin/minus' + id)
		//setUserList(rtn.data)
	}

	return (
		<div className="userList-container">
			{userList?.map(user=>
			<div className="userList-box">
				<button className="userList-btn" onClick={() => myInfo.status === 'administrator' && 'jinkim' !== user.id && user.status === 'none' ? openUserListModal(user.id): null}>
					<span className="iconBox">
						<span><img src={findImg(user.icon)} width="30" height="30" className="icon"/></span>
						<span>{user.status !== 'none' ?
							<img src={crown} width="20" height="20" className={user.status === 'owner' ? 'crown owner' : 'crown administrator'}/>
							: null
						}</span>
					</span>
					<span className='id'>{user.id}</span>
				</button>
				<span>{myInfo.status === 'owner' && user.status === 'none' ?
					<button className="owner-plusBtn" onClick={() => plusBtn(user.id)}>+</button>
					: null
				}</span>
				<span>{myInfo.status === 'owner' && user.status === 'administrator' ?
					<button className="owner-xBtn" onClick={() => minusBtn(user.id)}>x</button>
					: null
				}</span>
			</div>
			)}
			<UserListModal open={UserListModalState} close={closeUserListModal} targetID={chatUser}></UserListModal>
		</div>

	);
  };
  export default UserList;
