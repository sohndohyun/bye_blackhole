import axios from "axios";
import {useEffect, useState, useCallback} from "react";
import "./styles/Lobby.scss"
import plusbtn from "../Images/plusbutton.png"
import SideBar from '../SideBar/SideBar'
import GameListModal from './GameListModal'
import ChatListModal from './ChatListModal'
import ChatList from './ChatList'
import GameList from './GameList'

const Lobby = () => {
	const [MyID, setMyID] = useState('')

	useEffect(() => {
		const id = sessionStorage.getItem('nickname')
		if (id) setMyID(id)
	})

	//game list modal
	const [GameListModalState, setGameListModalState] = useState(false);
	const openGameListModal = () => {
		setGameListModalState(true);
	}
	const closeGameListModal = () => {
		setGameListModalState(false);
	}

	//chat list modal
	const [ChatListModalState, setChatListModalState] = useState(false);
	const openChatListModal = () => {
		setChatListModalState(true);
	}
	const closeChatListModal = () => {
		setChatListModalState(false);
	}

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
				<GameListModal open={GameListModalState} close={closeGameListModal} MyID={MyID}/>
				<hr/>
				<GameList/>
			</div>

			<div className="list-box">
				<div className="listName">
					Chat<button type="button" className="plusbtn" onClick={openChatListModal}><img src={plusbtn} width="30" height="30"/></button>
				</div>
				<ChatListModal open={ChatListModalState} close={closeChatListModal} MyID={MyID}/>
				<hr/>
				<ChatList MyID={MyID}/>
			</div>
		</span>
		<span className="App-Right">
			<SideBar />
		</span>
	</div>
	)
}

export default Lobby;