import axios from "axios";
import useSwr from 'swr';
import "./styles/GetChatList.scss"

const GetChatList = (props: any) => {
	const {myID} = props

	const fetcher = async (url:string) => {
		if (myID)
		{
			const res = await axios.get(url)
			return res.data;
		}
	}

	const {data, error, mutate} = useSwr<{title:string, num: number}[]>('/Lobby/myChatList?id=' + myID, fetcher)

	const LeaveChat = async(title:string) => {
		await axios.delete('Lobby?title=' + title + '&id=' + myID)
		mutate()
	}

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
				<button type="button" className="chatLeave" onClick={() => LeaveChat(chat.title)}>X</button>
			</div>
		)}
	</>
	)
}

export default GetChatList