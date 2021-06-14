import React, {useState} from "react";
import "./styles/RoomList.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from './Modal';
import axios from 'axios';

interface HomeObj{
	userName:any,
	roomName:any,
	setRoomName:(value:any)=>void,
}

const RoomList = ({ userName, roomName, setRoomName}: HomeObj) => {
  const handleRoomNameChange = (e:any) => {
    setRoomName(e.target.value);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
	setModalOpen(true);
  }
  const closeModal = () => {
	setModalOpen(false);
  }

  sessionStorage.setItem("roomName", roomName);

  //const [roomInfo, setRoomInfo] = useState<{id:string, password:string, owner_id:string}>();

  async function makeRoom(){
	  userName = userName ? userName : sessionStorage.getItem("userName")
	  const roomInfo = {id:roomName, password:"", owner_id:userName}

	  const res = await axios.post('/RoomList/insert', {roomInfo});
	  //setRoomInfo(res.data.roomInfo)
  }

  return (
    <div className="RoomList-container">
		<div className="makeRoom-box">
			<a className="btn btn-primary btn-sm makeRoom" onClick={openModal}><b>방 만들기</b></a>
			<Modal open={modalOpen} close={closeModal} header="방 만들기">
				<label ><b>방 제목</b></label>
				<input onChange={handleRoomNameChange}></input>
				{makeRoom}
			</Modal>
		</div>

		<div className="RoomList">
			방 목록...
		</div>
		<div className="Join-button">
			<a className="btn btn-dark" href="/Chat"><b>입장하기</b></a>
		</div>
    </div>
  );
};

export default RoomList;