import axios from "axios";
import {useEffect, useState, useCallback} from "react";
import "./styles/Lobby.scss"
import plusbtn from "../images/plusbutton.png"
import lock_icon from '../images/private.png'
import speed from '../images/speed.png'
import RightList from './RightList'
import GameListModal from './GameListModal'
import ChatListModal from './ChatListModal'


const Lobby = () => {

	const [gameList, setGameList] = useState<{player1:string, player2:string, mode:string}[]>([{player1:"inkimasasdfasdfasdf", player2:"jachoi", mode:"speed"}, {player1:"dshon", player2:"taekkim", mode:"normal"},{player1:"dshon", player2:"taekkim", mode:"speed"}, {player1:"jinkim", player2:"jachoi", mode:"speed"}, {player1:"dshon", player2:"taekkim", mode:"normal"}]);

	const [chatList, setChatList] = useState<{id:string, password:string, owner_id:string, num:number}[]>([{id:"chat_r1asdfasdfasdfa", password:"", owner_id:"oid1", num:5}, {id:"chat_r2", password:"1234", owner_id:"oid1", num:1}]);
	useEffect(() => {
		async function get(){
			//axios.get('')
			//.then((res) => setGameList(res.data))
			//.catch((err)=> console.log(err))

			//const res = await axios.get('')
			//setChatList(res.data)
		}
		get();
	})


	//modal
	//game list modal
	const [GameListModalState, setGameListModalState] = useState(false);
	const openGameListModal = () => {
		setGameListModalState(true);
	}
	const closeGameListModal = () => {
		setGameListModalState(false);
	}
	async function makeNewGame(){
		//userName = userName ? userName : sessionStorage.getItem("userName")
		//await axios.post('/RoomList', {id:roomName, password:pw, owner_id:userName});
	}

	//chat list modal
	const [ChatListModalState, setChatListModalState] = useState(false);
	const openChatListModal = () => {
		setChatListModalState(true);
	}
	const closeChatListModal = () => {
		setChatListModalState(false);
	}
	async function makeNewChat(){
		//userName = userName ? userName : sessionStorage.getItem("userName")
		//await axios.post('/RoomList', {id:roomName, password:pw, owner_id:userName});
	}

	const [NewRoomName, setNewRoomName] = useState("");
	//const [, setRoomName] = useState("");
	const handleRoomNameChange = useCallback((e:any) => {
		setNewRoomName(e.target.value);
		//checkedRoomInfo(e.target.value)
	}, []);
	// private room checkbox
	const [IsPrivateRoom, setIsPrivateRoom] = useState(false);
	const PrivateRoomCheckHandler = useCallback( (e:any) => {
		setIsPrivateRoom(!IsPrivateRoom);
	},[IsPrivateRoom]);
	// room pwd
	const [RoomPWD, setRoomPWD] = useState("");
	const handelRoomPWD = useCallback((e:any) => {
		setRoomPWD(e.target.value)
	}, []);



	return (
	<div id="App-Container">
		<span className="App-Left">
			<div className="list-box">
				<div className="listName">
					Game
					<button type="button" className="plusbtn" onClick={openGameListModal}>
						<img src={plusbtn} width="30" height="30"/>
					</button>
				</div>
				<GameListModal open={GameListModalState} close={closeGameListModal} header="New Game" makeRoom={makeNewGame}>
					<span><input type="radio" name="speed" value="5" /> easy &nbsp;&nbsp;</span>
					<span><input type="radio" name="speed" value="10" /> normal &nbsp;&nbsp;</span>
					<span><input type="radio" name="speed" value="20" /> hard </span>
				</GameListModal>
				<hr/>

				{gameList?.map(gameRoom=>
					<button type="button" className="roomList">
						<span className="roomList-left">
							<div className="roomList-icon">
							{gameRoom.mode === "normal" ? 'N' : <img src={speed} width="30" height="30"/>}
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
					Chat<button type="button" className="plusbtn" onClick={openChatListModal}><img src={plusbtn} width="30" height="30"/></button>
				</div>
				<ChatListModal open={ChatListModalState} close={closeChatListModal} header="New Chatting Room" makeRoom={makeNewChat}>
					<label >
						<b>Room Name:&nbsp;</b>
						<input onChange={handleRoomNameChange}></input>
					</label>
					<label>
						&nbsp;&nbsp;<input type="checkbox" checked={IsPrivateRoom} onChange={(e) => PrivateRoomCheckHandler(e)} ></input> private
					</label>
					{IsPrivateRoom ?
						<div className="checkbox-pwd">
						<b>&nbsp;&nbsp;&nbsp;&nbsp;password:&nbsp;</b>
						<input type="password" onChange={handelRoomPWD}></input>
						</div>
						: null
					}
				</ChatListModal>
				<hr/>

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
		<span className="App-Right">
			<RightList />
		</span>
	</div>
	)
}

export default Lobby;