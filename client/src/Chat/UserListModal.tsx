import axios from 'axios';
import React from 'react';
import "../Lobby/styles/UserInfoModal.scss";

const UserListModal = ( props: any ) => {
	const { open, close, targetID} = props;

	async function kickUser(){
		//await axios.post('chat/' + chatRoomID + '/kick/' + targetID)
		
	}

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<div className="head">
						<button className="close" onClick={close}> &times; </button>
					</div>
					<div className="content">
						{targetID}
					</div>
					<hr/>
					<div className='bottom'>
						<span className="onoffbtn">
							<input type="checkbox" id="switch1" name="switch1" className="input__on-off"/>
							<label htmlFor="switch1" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Mute</span>
								<span className="off">Unmute</span>
							</label>
							<input type="checkbox" id="switch2" name="switch2" className="input__on-off"/>
							<label htmlFor="switch2" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Ban</span>
								<span className="off">UnBan</span>
							</label>
						</span>
						<div><a className="btn button" onClick={kickUser}><b>Kick</b></a></div>
					</div>
				</section>
			) : null }
		</div>
	)
}

export default UserListModal