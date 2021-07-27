import axios from 'axios';
import useSwr from 'swr';
import React, { useEffect, useState, useCallback } from 'react';
import "../SideBar/styles/UserInfoModal.scss";

const UserListModal = ( props: any ) => {
	const { open, close, targetID, roomName, getRoomInfoMutate} = props;

	const [IsMute, setIsMute] = useState(false)

	async function kickUser(){
		await axios.get('chat/kick?title=' + roomName + '&id=' + targetID)
		close()
		getRoomInfoMutate()
	}

	async function BanUser(){
		await axios.get('chat/ban?title=' + roomName + '&id=' + targetID)
		close()
		getRoomInfoMutate()
	}

	const fetcher = async (url:string) => {
		if (roomName && targetID)
		{
			const res = await axios.get(url)
			setIsMute(res.data.isMuted);
			return res.data;
		}
	}

	const {data, error} = useSwr<{isMuted:boolean}>('chat/mute?title=' + roomName + '&id=' + targetID, fetcher)

	const muteHandler = async() => {
		await axios.put('chat/mute', {title:roomName, id:targetID, isMuted : !IsMute})
		setIsMute(!IsMute);
	};


	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<div className="head">
						<button className="close" onClick={close}> &times; </button>
					</div>
					<div className="content targetID">
						{targetID}
					</div>
					<hr/>
					<div className='bottom'>
						<span className="onoffbtn">
							<input type="checkbox" id="switch1" name="switch1" className="input__on-off" checked={IsMute} onChange={muteHandler}/>
							<label htmlFor="switch1" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Mute</span>
								<span className="off">Unmute</span>
							</label>
						</span>
						<div>
							<span><a className="btn button" onClick={kickUser}><b>Kick</b></a></span>
							<span><a className="btn button kick-button" onClick={BanUser}><b>Ban</b></a></span>
						</div>
					</div>
				</section>
			) : null }
		</div>
	)
}

export default UserListModal