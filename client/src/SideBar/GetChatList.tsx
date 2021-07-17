import axios from "axios";
import useSwr from 'swr';
import "./styles/GetChatList.scss"

const GetChatList = (props: any) => {
	const {myID} = props

	const fetcher = async (url:string) => {
		const res = await axios.get(url)
		return res.data;
	}

	const {data, error} = useSwr<{title:string, num: number}[]>('/Lobby/myChatList/' + myID, fetcher)
	return (
	<>
		<div className="title"># my chats</div>
		{data?.map(chat=>
			<div className="chat">
				<button type="button" className="chat-btn" onClick={() => {
						document.location.href = '/Chat';
						sessionStorage.setItem('roomName', chat.title);
				}}>
					<span className="chatNum">{chat.num}</span>
					<span>&nbsp;{chat.title}</span>
				</button>
				<button type="button" className="chatLeave">X</button>
			</div>
		)}
	</>
	)
}

export default GetChatList