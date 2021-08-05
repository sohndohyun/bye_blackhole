//import logo from './logo.svg';
import React, { useState } from 'react';
import './App.scss';
import Chat from './Chat/Chat';
import Admin from './Admin/Admin';
import Lobby from './Lobby/Lobby';
import './Chat/styles/global.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Auth from './Auth/Auth';
import Pong from './Pong/Pong';

function App() {
  const redirect_auth = () => {
    window.location.href = '/log/auth';
    return null;
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              sessionStorage.getItem('intraID') ? <Lobby /> : redirect_auth()
            )}
          />
          <Route exact path="/2-factor-auth" render={() => <Auth />} />
          <Route
            path="/Admin"
            exact
            render={() => (
              sessionStorage.getItem('intraID') ? <Admin /> : redirect_auth()
            )}
          />
          <Route
            path="/Lobby"
            exact
            render={() => (
              sessionStorage.getItem('intraID') ? <Lobby /> : redirect_auth()
            )}
          />
          <Route
            path="/Chat"
            exact
            render={() =>
              sessionStorage.getItem('intraID') ? <Chat /> : redirect_auth()
            }
          />
          <Route exact path="/Pong" render={() => <Pong />} />
          <Route
            render={({ location }) => <div>Not Found {location.pathname}</div>}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
