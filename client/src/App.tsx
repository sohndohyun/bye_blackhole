//import logo from './logo.svg';
import React, {useState} from "react";
import './App.scss';
import Chat from "./Chat/Chat";
import Home from "./Home/Home";
import RoomList from "./Chat/RoomList"
import Lobby from "./Lobby/Lobby"
import "./Chat/styles/global.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	const [userName, setUserName] = useState();
	const [roomName, setRoomName] = useState();
	const [icon, setIcon] = useState();

	return (
	  <div className="App">
		<Router>
		  <Switch>
			<Route path="/" exact>
			  <Home
				userName={userName}
				setUserName={setUserName}
				icon={icon}
				setIcon={setIcon}
				/>
			</Route>
			<Route path="/RoomList" exact render={() => <RoomList
				userName={userName}
				roomName={roomName}
				setRoomName={setRoomName}
			  />}>
			</Route>
			<Route path="/Lobby" exact>
				<Lobby/>
			</Route>
			<Route
			  path="/Chat"
			  exact
			  render={() => <Chat userName={userName} roomName={roomName} icon={icon}/>}
			></Route>
			<Route
          		render={({location}) => (
            		<div>
              			Not Found {location.pathname}
            		</div>
          		)}
        	/>
		  </Switch>
		</Router>
	  </div>
	);
  }


export default App;