import React , {useState, useCallback}from 'react';
import axios from "axios";
import "./styles/Modal.scss";

const GameListModal = ( props: any ) => {
	const { open, close, MyID} = props;

	const [IsSpeed, setIsSpeed] = useState(false)

	const modeHandler = useCallback((e:any) => {
		if (e.target.value === 'speed')
			setIsSpeed(true)
		else
			setIsSpeed(false)
	}, [])

	function makeNewGame(){
		axios.post('/Lobby/GameCreate', {nickname:MyID, speed:IsSpeed, ladder:false})
		.then((res) => {
			document.location.href = '/Game'
		})
		.catch((err) => {
			//매칭실패!!
		})
	}

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<header>
						New Game
						<button className="close" onClick={close}> &times; </button>
					</header>
					<main>
						<span><input type="radio" name="speed" value="normal" onClick={modeHandler} /> normal &nbsp;&nbsp;</span>
						<span><input type="radio" name="speed" value="speed" onClick={modeHandler} /> speed </span>
					</main>
					<footer>
						<a className="btn btn-primary" onClick={makeNewGame}><b>Matching Start</b></a>
					</footer>
				</section>
			) : null }
		</div>
	)
}

export default GameListModal