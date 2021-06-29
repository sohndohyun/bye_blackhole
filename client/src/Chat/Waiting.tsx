import axios from "axios";
import {useEffect, useState} from "react";
import "./styles/Waiting.scss"
import plusbtn from "../images/plusbutton.png"
import lock_icon from '../images/private.png'
import speed from '../images/speed.png'
import userIcon from '../images/gamer_boy.png'


const Waiting = () => {

	const [gameList, setGameList] = useState<{player1:string, player2:string, mode:string}[]>();
	useEffect(() => {
		//axios.get('')
		//.then((res) => setGameList(res.data))
		//.catch((err)=> console.log(err))
		setGameList([{player1:"inkimas", player2:"jachoi", mode:"speed"}, {player1:"dshon", player2:"taekkim", mode:"speed"}, {player1:"jinkim", player2:"jachoi", mode:"speed"}, {player1:"dshon", player2:"taekkim", mode:"normal"}])
	})

	const [chatList, setChatList] = useState<{id:string, password:string, owner_id:string, num:number}[]>();
	useEffect(() => {
		//const res = await axios.get('')
		//setChatList(res.data)
		setChatList([{id:"chat_r1", password:"", owner_id:"oid1", num:5}, {id:"chat_r2", password:"1234", owner_id:"oid1", num:1}])
	})

	const [friendsList, setFriendsList] = useState<{id:string, icon:string ,state:string}[]>();
	useEffect(() => {
		//const res = await axios.get('')
		//setFriendsList(res.data)
		setFriendsList([{id:"jinkim_online", icon:"gamer_boy", state:"online"}, {id:"jinkim_offline", icon:"gamer_boy", state:"offline"}, {id:"jinkim_gaming", icon:"gamer_boy", state:"gaming"}])
	})

	const [othersList, setOthersList] = useState<{id:string, icon:string ,state:string}[]>();
	useEffect(() => {
		//const res = await axios.get('')
		//setOthersList(res.data)
		setOthersList([{id:"jinkim_online", icon:"gamer_boy", state:"online"}, {id:"jinkim_offline", icon:"gamer_boy", state:"offline"}, {id:"jinkim_gaming", icon:"gamer_boy", state:"gaming"}])
	})

	const [myChatList, setMyChatList] = useState<{id:string, num:number}[]>();
	useEffect(() => {
		//const res = await axios.get('')
		//setMyChatList(res.data)
		setMyChatList([{id:"chat_r1", num:5}, {id:"chat_r2", num:1},{id:"chat_r1", num:5}])
	})


	return (
	<div id="container">
		<span className="listLeft">
			<div className="list-box">
				<div className="listName">
					Game<button type="button" className="plusbtn"><img src={plusbtn} width="30" height="30"/></button>
					<hr/>
				</div>
				{gameList?.map(gameRoom=>
					<button type="button" className="roomList">
						<span className="roomList-left">
							<div className="roomList-icon">
							{gameRoom.mode === "speed" ? <img src={speed} width="30" height="30"/> : null}{gameRoom.mode === "normal" ? 'N' : null}
							</div>
						</span>
						<span className="roomList-right">
							<div className="player">{gameRoom.player1}</div>
							<div>vs</div>
							<div className="player">{gameRoom.player2}</div>
						</span>
					</button>
				)}
			</div>
			<div className="list-box">
				<div className="listName">
					Chat<button type="button" className="plusbtn"><img src={plusbtn} width="30" height="30"/></button>
					<hr/>
				</div>
				{chatList?.map(chatRoom=>
					<button type="button" className="roomList">
					<span className="roomList-left">
						<div className="roomList-num">{chatRoom.num}</div>
					</span>
					<span className="roomList-right">
						<div>
							{chatRoom.password != "" ? <img src={lock_icon} width="20" height="20"></img> : null}
						</div>
						<div className="player">
							{chatRoom.id}
						</div>
					</span>
					</button>
				)}
			</div>
		</span>
		<span className="listRight">
			<div className="listRight-top">
				jinkim
				<button type="button" className="myIcon"><img src={userIcon} width="30" height="30"></img></button>
			</div>
			<div className="listRight-bottom">
				<div className="title"># friends</div>
				{friendsList?.map(user=>
					<button type="button" className="user-btn">
						<img src={userIcon}  width="20" height="20" className="user-icon"/>
						{user.state === "online" ? <span className="userState online">·</span> : null}
						{user.state === "offline" ? <span className="userState offline">·</span> : null}
						{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
						{user.id}
					</button>
				)}
				<div className="title"># others</div>
				{othersList?.map(user=>
					<button type="button" className="user-btn">
						<img src={userIcon}  width="20" height="20" className="user-icon"/>
						{user.state === "online" ? <span className="userState online">·</span> : null}
						{user.state === "offline" ? <span className="userState offline">·</span> : null}
						{user.state === "gaming" ? <span className="userState gaming">·</span> : null}
						{user.id}
					</button>
				)}
				<div className="title"># my chats</div>
				{myChatList?.map(chat=>
					<div className="chat">
					<button type="button" className="chat-btn">
						<span className="chatNum">{chat.num}</span>
						<span>&nbsp;{chat.id}</span>
					</button>
						<button type="button" className="chatLeave">X</button>
					</div>
				)}
			</div>
		</span>
	</div>
	)
}

export default Waiting;