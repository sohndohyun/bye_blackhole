//import logo from './logo.svg';
import React, {useState} from "react";
import './App.scss';
import Chat from "./Chat/Chat";
import Admin from "./Admin/Admin";
import Lobby from "./Lobby/Lobby"
import Login from './Login/Login'
import "./Chat/styles/global.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	return (
	<div className="App">
		<Router>
		  <Switch>
			{
			<Route exact path="/" render={() => 
				<Login />
			}/>
			}
			<Route path="/Admin" exact render={() =>
				<Admin/>
			}/>
			<Route path="/Lobby" exact render={() =>
				<Lobby/>
			}/>
			<Route path="/Chat" exact render={() =>
				<Chat/>
			}/>
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