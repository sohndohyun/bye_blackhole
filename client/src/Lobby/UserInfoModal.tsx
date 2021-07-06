import React from 'react';
import "./styles/UserInfoModal.scss";

interface Iprops {
	open: any,
	close: any,
	myID: string,
	targetID: string,
	WinLoseNum: {win:number, lose:number},
	MatchHistory: {id:string, result:boolean}[],
}

const UserInfoModal = ( props: Iprops ) => {
	const { open, close, myID, targetID, WinLoseNum, MatchHistory} = props;

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
							<span className="num win-color">W {WinLoseNum.win}</span>
							<span className="num lose-color"> &nbsp;&nbsp; L {WinLoseNum.lose}</span>
						</div>
						<hr/>
						<div className="main">
							{MatchHistory?.map(match=>
							<div className={match.result ? 'matchHistory win-backColor' : 'matchHistory lose-backColor'}>
								<span className='match-left'>{match.id}</span>
								<span className={match.result ? 'match-right win-color' : 'match-right lose-color'}>{match.result ? 'Win' : 'Lose'}</span>
							</div>
							)}
						</div>
					</div>
					<div className="bottom">
					{myID === targetID ? 
						<a className="btn button" onClick={()=> document.location.href = '/Admin/' + targetID}><b>Admin</b></a> :
						<div>
						<span className="onoffbtn">
							<input type="checkbox" id="switch1" name="switch1" className="input__on-off"/>
							<label htmlFor="switch1" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Friend</span>
								<span className="off">Unfriend</span>
							</label>
						</span>
						<span className="onoffbtn">
							<input type="checkbox" id="switch2" name="switch2" className="input__on-off"/>
							<label htmlFor="switch2" className="label__on-off">
								<span className="marble"></span>
								<span className="on">Unblock</span>
								<span className="off">Block</span>
							</label>
						</span>
						<div><a className="btn button" href="/Game"><b>Game</b></a></div>
						</div>
					}
					</div>
				</section>
			) : null }
		</div>
	)
}

export default UserInfoModal