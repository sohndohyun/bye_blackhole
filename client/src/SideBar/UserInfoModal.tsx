import React, { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import useSwr from 'swr';
import "./styles/UserInfoModal.scss";
import DirectGameModal from './DirectGameModal';

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

	const {data, error} = useSwr<{history:{win:boolean, id:string}[] ,friend:boolean, block:boolean, win:number, lose:number, ladder:number} | {history:{win:boolean, id:string}[], win:number, lose:number, ladder:number}>('profile?myID=' + myID + '&otherID=' + targetID, fetcher)

	const FriendHandler = useCallback( async() => {
		await axios.put('profile/friend', {myID:myID, otherID:targetID, isFriend:!IsFriend})
		setIsFriend(!IsFriend);
	},[IsFriend]);
	
	const BlockHandler = useCallback( async() => {
		await axios.put('profile/block', {myID:myID, otherID:targetID, isBlock:!IsBlock})
		setIsBlock(!IsBlock);
	},[IsBlock]);

	//block modal
	const [BlockModal, setBlockModal] = useState(false);

	async function makeDM(){
		if (myID.localeCompare(targetID) < 0)
			var chatRoomName = 'DM_' + myID + '_' + targetID
		else
			var chatRoomName = 'DM_' + targetID + '_' + myID
		await axios.post('/Lobby/chatCreate', {title: chatRoomName, password:'', owner_id:myID, security:'private'})
		.then((res) => {
			document.location.href = '/chat'
			sessionStorage.setItem('roomName', chatRoomName)
		})
		.catch((err) => {
			setBlockModal(true)
		})
	}

	//direct game modal
	const [DirectGameModalState, setDirectGameModalState] = useState(false);
	const openDirectGameModal = () => {
		/*
		if (window.location.pathname === '/chat' || window.location.pathname === '/Chat')
		{
			window.location.href = '/lobby'
			sessionStorage.removeItem('roomName')
			sessionStorage.setItem('directGame', targetID)
		}
		*/
		setDirectGameModalState(true);
	};
	const closeDirectGameModal = () => {
		setDirectGameModalState(false);
	};

	async function Logout(){
		const intra_id = sessionStorage.getItem('intraID')
		await axios.patch('log/out' , {intra_id : intra_id})
		sessionStorage.removeItem('2auth')
		document.location.href = '/log/in'
	}

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? ( 
			  BlockModal ? 
				<section>
					<div className="head">
						<button className="close" onClick={() => {
							close()
							setBlockModal(false)
						}}> &times; </button>
					</div>
					<div className="content">
						<div className="header">
							<hr/>
							<div className="name lose-color">DM 채팅방을 생성할 수 없습니다.</div>
							<hr/>
						</div>
					</div>
				</section>
				:
				<section>
					<div className="head">
						<button className="close" onClick={close}> &times; </button>
					</div>
					<div className="content">
						<div className="header">
							<div className="name">{targetID}</div>
							<span className="num win-color">W {data?.win}</span>
							<span className="num lose-color"> &nbsp;&nbsp; L {data?.lose}</span>
							<div className="num">ladder {data?.ladder}</div>
						</div>
						<hr/>
						<div className="main">
							{data?.history?.map(match=>
							<div className={match.win ? 'matchHistory win-backColor' : 'matchHistory lose-backColor'}>
								<span className='match-left'>{match.id}</span>
								<span className={match.win ? 'match-right win-color' : 'match-right lose-color'}>{match.win ? 'Win' : 'Lose'}</span>
							</div>
							)}
						</div>
					</div>
					<div className="bottom">
					{myID === targetID ? 
						<>
							<a className="btn button" onClick={()=> 
								document.location.href = '/Admin/'
							}><b>Admin</b></a>
							&nbsp;
							<a className="btn button" onClick={Logout}><b>Logout</b></a>
						</>
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
							<a className="btn button" onClick={openDirectGameModal}><b>Game</b></a>
							<a className="btn button dm-button" onClick={makeDM}><b>DM</b></a>
						</div>
						</div>
					}
					</div>
					<DirectGameModal open={DirectGameModalState} close={closeDirectGameModal} targetID={targetID} closeUserInfoModal={close}/>
				</section>
			): null }
		</div>
	)
}

export default UserInfoModal