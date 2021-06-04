import logo from './logo.svg';
import React, {useState} from "react";
import './App.css';
//import Hello, {Wrapper, Counter, InputSample} from './Hello';
import Chat from "./Chat/Chat";
import Home from "./Chat/Home";
import "./Chat/global.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

/*
function App()
{
	return (
		<Wrapper>
			<Hello color="red" name="react" isSpecial/>
			<Hello color="orange"/>
			<Counter />
			<InputSample />
		</Wrapper>
	)
}
*/


function App() {
	const [userName, setUserName] = useState();
	const [roomName, setRoomName] = useState();

	return (
	  <div className="App">
		<Router>
		  <Switch>
			<Route path="/" exact>
			  <Home
				userName={userName}
				roomName={roomName}
				setUserName={setUserName}
				setRoomName={setRoomName}
			  />
			</Route>
			<Route
			  path="/chat"
			  exact
			  render={() => <Chat userName={userName} roomName={roomName} />}
			></Route>
		  </Switch>
		</Router>
	  </div>
	);
  }


export default App;