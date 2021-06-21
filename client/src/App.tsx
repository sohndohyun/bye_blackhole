//import logo from './logo.svg';
import React, {useState} from "react";
//import './App.css';
//import Hello, {Wrapper, Counter, InputSample} from './Hello';
import Chat from "./Chat/Chat";
import Home from "./Chat/Home";
import RoomList from "./Chat/RoomList"
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
			<Route path="/RoomList/insert">
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