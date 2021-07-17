import axios from "axios";
import useSwr from 'swr';
import {useEffect, useState} from "react";
import "./styles/SideBar.scss"
import {findImg} from '../Images/Images'
import UserInfoModal from "./UserInfoModal";
import GetChatList from './GetChatList'

const SideBar = () => {
	const [MyID, setMyID] = useState('')
	const [MyIcon, setMyIcon] = useState('')
	
	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		const icon = sessionStorage.getItem('icon')
		if (id) setMyID(id)
		if (icon) setMyIcon(icon)
	})
	
	const fetcher = async (url:string) => {
		const res = await axios.get(url)
		return res.data;
	}

	const {data, error} = useSwr<{id:string, icon:string, state:string, isFriend:boolean}[]>('/Lobby/userList/' + MyID, fetcher)


	//UserInfoModal
	const [TargetID, setTargetID] = useState('');
	const [UserInfoModalState, setUserInfoModalState] = useState(false);
	const openUserInfoModal = async(id:string) => {
		setUserInfoModalState(true);
		setTargetID(id);
	}
	const closeUserInfoModal = () => {
		setUserInfoModalState(false);
	}

	return(
	<aside>
		<div className="top">
			<span className="MyID">{MyID}</span>
			<button type="button" className="myIcon" onClick={() => openUserInfoModal(MyID)}>
				<img src={findImg(MyIcon)} width="30" height="30"></img>
			</button>
		</div>
		<div className="bottom">
			<div className="title"># friends</div>
			{data?.map(user=> user.isFriend ?
				<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
					<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
					{user.state === "on" ? <span className="userState online">·</span> : null}
					{user.state === "off" ? <span className="userState offline">·</span> : null}
					{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
					{user.id}
				</button>
				: null
			)}
			<div className="title"># others</div>
			{data?.map(user => user.isFriend ? null :
				<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
					<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
					{user.state === "on" ? <span className="userState online">·</span> : null}
					{user.state === "off" ? <span className="userState offline">·</span> : null}
					{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
					{user.id}
				</button>
			)}
			
			<GetChatList myID={MyID}/>

			<UserInfoModal open={UserInfoModalState} close={closeUserInfoModal} myID={MyID} targetID={TargetID}/>
		</div>
	</aside>
	)
}
export default SideBar;