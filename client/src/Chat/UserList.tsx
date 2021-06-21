import React, { useEffect, useState } from "react";
import "./styles/UserList.css"
//import img from '../images/gamer_boy.png'

const UserList = ({ socket }: any) => {
	const [userList, setUserList] = useState<{id: string, room: string, icon:any}[]>();

	useEffect(() => {
	  socket.on("UserList", (newUser:{id: string, room: string, icon:any}[]) => {

		setUserList(newUser);
	  });

	  return () => {
		socket.disconnect();
	  };
	}, [socket]);

	return (
		<div>
			{userList?.map(user=>
			<div id="userList">
				<span className="userIcon">
					<img src={`data:image/jpeg;base64,${(user.icon).toString()}`} height="50" width="50" className="icon"/>
				</span>
				<span className="userInfo">
					<div className="id">{user.id}</div>
					<div className="room">{user.room}</div>
				</span>
			</div>
			)}
		</div>

	);
  };
  export default UserList;
