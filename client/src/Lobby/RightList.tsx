import axios from "axios";
import {useEffect, useState} from "react";
import "./styles/RightList.scss"
import {findImg} from '../Images/Images'
import userIcon from '../Images/gamer_boy.png'
import UserInfoModal from "./UserInfoModal";

const RightList = () => {
	
	const [friendsList, setFriendsList] = useState<{id:string, icon:string ,state:string}[]>([{id:"jinkim_online", icon:"gamer_boy", state:"online"}, {id:"jinkim_offline", icon:"gamer_keyboard", state:"offline"}, {id:"jinkim_gaming", icon:"gamer_girl", state:"gaming"}]);

	const [othersList, setOthersList] = useState<{id:string, icon:string ,state:string}[]>([{id:"jinkim_online", icon:"gamer_woman", state:"online"}, {id:"jinkim_offline", icon:"woman_icon", state:"offline"}, {id:"jinkim_gaming", icon:"man_icon", state:"gaming"}]);

	const [myChatList, setMyChatList] = useState<{id:string, num:number}[]>([{id:"chat_r1asdfasdfasdf", num:5}, {id:"chat_r2", num:1},{id:"chat_r1", num:5}]);

	useEffect(() => {
		async function get() {
			//const res = await axios.get('')
			//setFriendsList(res.data)
			
			//const res = await axios.get('')
			//setOthersList(res.data)
			
			//const res = await axios.get('')
			//setMyChatList(res.data)
		}
		get();
	})


	const [WinLoseNum, setWinLoseNum] = useState<{win:number, lose:number}>({win:4, lose:0})
	const [MatchHistory, setMatchHistory] = useState<{id:string, result:boolean}[]>([{id:'jachoi', result:true}, {id:'dsohn', result:false}, {id:'taekkim', result:true}, {id:'sayi', result:true}]);
	async function getProfile(id:string) {
		console.log('getProfile!!')
		//const profile = await axios.get('profile/' + id)
		//setWinLoseNum({win:profile.data.win, lose:profile.data.lose})

		//const match = await axios.get('profile/' + id + '/match')
		//setMatchHistory(match.data)
	}

	//UserInfoModal
	const [ModalID, setModalID] = useState('');
	const [UserInfoModalState, setUserInfoModalState] = useState(false);
	const openUserInfoModal = (id:string) => {
		setUserInfoModalState(true);
		setModalID(id);
		getProfile(id);
	}
	const closeUserInfoModal = () => {
		setUserInfoModalState(false);
	}

	

	return(
	<span>
	<div className="top">
		jinkim
		<button type="button" className="myIcon" onClick={() => openUserInfoModal('jinkim')}>
			<img src={userIcon} width="30" height="30"></img>
		</button>
	</div>
	<div className="bottom">
		<div className="title"># friends</div>
		{friendsList?.map(user=>
			<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
				<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
				{user.state === "online" ? <span className="userState online">·</span> : null}
				{user.state === "offline" ? <span className="userState offline">·</span> : null}
				{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
				{user.id}
			</button>
		)}
			
		<div className="title"># others</div>
		{othersList?.map(user=>
			<button type="button" className="user-btn" onClick={() => openUserInfoModal(user.id)}>
				<img src={findImg(user.icon)}  width="20" height="20" className="user-icon"/>
				{user.state === "online" ? <span className="userState online">·</span> : null}
				{user.state === "offline" ? <span className="userState offline">·</span> : null}
				{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
				{user.id}
			</button>
		)}
		<div className="title"># my chats</div>
		{myChatList?.map(chat=>
			<div className="chat">
			<button type="button" className="chat-btn" onClick={() => document.location.href = '/Chat/' + chat.id}>
				<span className="chatNum">{chat.num}</span>
				<span>&nbsp;{chat.id}</span>
			</button>
				<button type="button" className="chatLeave">X</button>
			</div>
		)}

		<UserInfoModal open={UserInfoModalState} close={closeUserInfoModal} myID='jinkim' targetID={ModalID} WinLoseNum={WinLoseNum} MatchHistory={MatchHistory} />
	</div>
	</span>
	)
}
export default RightList;