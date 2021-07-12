import axios from 'axios';
import React, {useState, useCallback} from 'react';
import "../Lobby/styles/Modal.scss";

const ChatOwnerModal = ( props: any ) => {
	const { open, close, chatRoomID} = props;

	async function changePWD(){
		//await axios.post('chat/' + chatRoomID + '/admin/')
		close();
	}

	const [RoomPWD, setRoomPWD] = useState('');
	const handelRoomPWD = useCallback((e:any) => {
		setRoomPWD(e.target.value)
	}, []);

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<header>
						Change Password
						<button className="close" onClick={close}> &times; </button>
					</header>
					<main>
						password:&nbsp;
						<input onChange={handelRoomPWD} value={RoomPWD}></input>
					</main>
					<footer>
						<a className="btn btn-primary" onClick={changePWD}><b>Change</b></a>
					</footer>
				</section>
			) : null }
		</div>
	)
}

export default ChatOwnerModal