import React, {useState, useCallback, useEffect} from 'react';
import axios from "axios";
import "./styles/Modal.scss";

const PwdCheckModal = ( props: any ) => {
	const { open, close, chatRoomID, MyID} = props;

	const [PWD, setPWD] = useState("");
	const [WorngPWD, setWrongPWD] = useState(false)

	const handelPWD = useCallback((e:any) => {
		setPWD(e.target.value)
	}, []);

	async function confirmPWD(){
		await axios.post('/Lobby/enter', {title:chatRoomID, id:MyID, password:PWD})
		.then((res) => {
			document.location.href = '/Chat';
			sessionStorage.setItem('roomName', chatRoomID)
		})
		.catch((err) => {
			setWrongPWD(true)
		})
	}

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<header>
						Enter Password
						<button className="close" onClick={() => {
							close()
							setWrongPWD(false)
						}}> &times; </button>
					</header>
					<main>
						password: <input onChange={handelPWD}></input>
						{WorngPWD ? <label className="error">틀린 비밀번호입니다.</label> : null}
					</main>
					<footer>
						<a className="btn btn-primary" onClick={confirmPWD}><b>Enter</b></a>
					</footer>
				</section>
			) : null }
		</div>
	)
}

export default PwdCheckModal