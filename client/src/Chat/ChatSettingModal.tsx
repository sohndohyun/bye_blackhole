import axios from 'axios';
import useSwr from 'swr';
import React, {useState, useCallback} from 'react';
import "./styles/ChatSettingModal.scss";

const ChatSettingModal = ( props: any ) => {
	const { open, close, chatRoomID, MyPermission} = props;

	async function changePWD(){
		await axios.post('chat/setting' , {title:chatRoomID, password:RoomPWD})
		close();
	}

	const fetcher = async (url:string) => {
		if (chatRoomID)
		{
			const res = await axios.get(url)
			return res.data;
		}
	}
	const {data, error, mutate} = useSwr<{id:string}[]>('Chat/banList?title=' + chatRoomID, fetcher)

	async function Unban(user: {id:string}){
		await axios.get('chat/unban?title=' + chatRoomID + '&id=' + user)
		mutate()
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
						Setting
						<button className="close" onClick={close}> &times; </button>
					</header>
					<main>
						<div className="ban-name"><b>Banned users</b></div>
						<div className="ban-box">
							{data?.map(user => 
								<>
								<div className="ban-inlineBox">
									<span className="ban-user">{user}</span>
									<span className="unban" onClick={() => Unban(user)}><a className="btn unban-btn">x</a></span>
								</div>
									<hr/>
								</>
							)}
						</div>
						{MyPermission === 'owner' ? 
							<>
							<hr />
							new password:&nbsp;
							<input onChange={handelRoomPWD} value={RoomPWD}></input>
							&nbsp;
							<a className="btn btn-primary btn-sm" onClick={changePWD}><b>Change</b></a>
							</>
							: null
						}
					</main>
					<footer>
					</footer>
				</section>
			) : null }
		</div>
	)
}

export default ChatSettingModal