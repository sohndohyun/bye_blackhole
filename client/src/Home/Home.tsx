import React from "react";
import "./styles/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {allImages} from '../Images/Images';

interface HomeObj{
	userName:any,
	setUserName:(value:any)=>void,
	icon:any,
	setIcon:(value:any)=>void
}

const Home = ({ userName, setUserName, icon, setIcon }: HomeObj) => {
  const handleUserNameChange = (e:any) => {
    setUserName(e.target.value);
  };
  const handleIconChange = (e:any) => {
    setIcon(e.target.value);
  };

  sessionStorage.setItem("userName", userName);
  sessionStorage.setItem("icon", icon);

  return (
    <div className="Home-container">
      <label><b>ID</b></label>
      <input onChange={handleUserNameChange}></input>

	  <div className="icon-container">
		{allImages.map(({value, src}) =>
			<span className="icon">
			<input type="radio" name="icon" value={value} onChange={handleIconChange} className="icon-input"/>
			<img src={src} width="50" height="50" className="icon-img"></img>
			</span>
		)}
	  </div>

	  <div className="Join-button">
	  	<a className="btn btn-dark" href="/Lobby"><b>로그인</b></a>
	  </div>
    </div>
  );
};

export default Home;