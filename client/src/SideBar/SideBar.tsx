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
	const [IntraID, setIntraID] = useState('')
	
	useEffect(() => {
		const intra_id = sessionStorage.getItem('intraID')
		if (intra_id) setIntraID(intra_id)
	})

	const GetMyProfile = async (url:string) => {
		if (IntraID)
		{
			const res = await axios.get(url)
			sessionStorage.setItem('nickname', res.data.id)
			sessionStorage.setItem('icon', res.data.icon)
			setMyID(res.data.id)
			setMyIcon(res.data.icon)
//			if (res.data.state === 'off')
//				document.location.href = '/log/in'
			return (res.data)
		}
	}
	useSwr<{id:string, icon:string, state:string}>('/profile/my?intra_id=' + IntraID, GetMyProfile)


	const fetcher = async (url:string) => {
		if (MyID)
		{
			const res = await axios.get(url)
			return res.data;
		}
	}

	const {data, error, mutate} = useSwr<{id:string, icon:string, state:string, isFriend:boolean}[]>('/Lobby/userList?id=' + MyID, fetcher)


	//UserInfoModal
	const [TargetID, setTargetID] = useState('');
	const [UserInfoModalState, setUserInfoModalState] = useState(false);
	const openUserInfoModal = async(id:string) => {
		setUserInfoModalState(true);
		setTargetID(id);
	}
	const closeUserInfoModal = () => {
		setUserInfoModalState(false);
		mutate()
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
				<div>
				<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
					<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
					{user.state === "on" ? <span className="userState online">·</span> : null}
					{user.state === "off" ? <span className="userState offline">·</span> : null}
					{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
					{user.id}
				</button>
				</div>
				: null
			)}
			<div className="title"># others</div>
			{data?.map(user => user.isFriend ? null :
				<div>
				<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
					<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
					{user.state === "on" ? <span className="userState online">·</span> : null}
					{user.state === "off" ? <span className="userState offline">·</span> : null}
					{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
					{user.id}
				</button>
				</div>
			)}
			
			<GetChatList myID={MyID}/>

			<UserInfoModal open={UserInfoModalState} close={closeUserInfoModal} myID={MyID} targetID={TargetID}/>
		</div>
	</aside>
	)
}
export default SideBar;