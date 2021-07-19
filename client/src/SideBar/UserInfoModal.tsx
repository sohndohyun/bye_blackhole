import React, { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import useSwr from 'swr';
import "./styles/UserInfoModal.scss";

const UserInfoModal = ( props: any) => {
	const { open, close, myID, targetID} = props;
	const [IsFriend, setIsFriend] = useState<boolean>()
	const [IsBlock, setIsBlock] = useState<boolean>()
	
	const fetcher = async (url:string) => {
		if (myID && targetID)
		{
			const res = await axios.get(url)
			setIsFriend(res.data.friend)
			setIsBlock(res.data.block)
			return res.data;
		}
	}

	const {data, error} = useSwr<{history:{win:boolean, p2:string}[] ,friend:boolean, block:boolean, win:number, lose:number} | {history:{win:boolean, p2:string}[], win:number, lose:number}>('profile?myID=' + myID + '&otherID=' + targetID, fetcher)

	const FriendHandler = useCallback( async() => {
		await axios.put('profile/friend', {myID:myID, otherID:targetID, isFriend:!IsFriend})
		setIsFriend(!IsFriend);
	},[IsFriend]);
	
	const BlockHandler = useCallback( async() => {
		await axios.put('profile/block', {myID:myID, otherID:targetID, isFriend:!IsBlock})
		setIsBlock(!IsBlock);
	},[IsBlock]);


	async function makeDM(){
		if (myID.localeCompare(targetID) < 0)
			var chatRoomName = 'DM_' + myID + '_' + targetID
		else
			var chatRoomName = 'DM_' + targetID + '_' + myID
		await axios.put('/Lobby/chatCreate/' + chatRoomName, {password:'', owner_id:myID, security:'private'})
		document.location.href = '/chat'
		sessionStorage.setItem('roomName', chatRoomName)
	}

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<div className="head">
						<button className="close" onClick={close}> &times; </button>
					</div>
					<div className="content">
						<div className="header">
							<div className="name">{targetID}</div>
							<span className="num win-color">W {data?.win}</span>
							<span className="num lose-color"> &nbsp;&nbsp; L {data?.lose}</span>
						</div>
						<hr/>
						<div className="main">
							{data?.history?.map(match=>
							<div className={match.win ? 'matchHistory win-backColor' : 'matchHistory lose-backColor'}>
								<span className='match-left'>{match.p2}</span>
								<span className={match.win ? 'match-right win-color' : 'match-right lose-color'}>{match.win ? 'Win' : 'Lose'}</span>
							</div>
							)}
						</div>
					</div>
					<div className="bottom">
					{myID === targetID ? 
						<a className="btn button" onClick={()=> document.location.href = '/Admin/'}><b>Admin</b></a>
						:
						<div>
						<span className="onoffbtn">
							<input type="checkbox" id="switch1" name="switch1" className="input__on-off" checked={IsFriend} onChange={FriendHandler}/>
							<label htmlFor="switch1" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Friend</span>
								<span className="off">Unfriend</span>
							</label>
						</span>
						<span className="onoffbtn">
							<input type="checkbox" id="switch2" name="switch2" className="input__on-off" checked={!IsBlock} onChange={BlockHandler}/>
							<label htmlFor="switch2" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Unblock</span>
								<span className="off">Block</span>
							</label>
						</span>
						<div>
							<a className="btn button" href="Game"><b>Game</b></a>
							<a className="btn button dm-button" onClick={makeDM}><b>DM</b></a>
						</div>
						</div>
					}
					</div>
				</section>
			) : null }
		</div>
	)
}

export default UserInfoModal