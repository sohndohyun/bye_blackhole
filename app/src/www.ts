import app from "./app";
import {createServer} from "http";
const socketIO = require("socket.io");
const cors = require("cors");
const chat_user = require('./DB/chat_user.ts');
const chat_room = require('./DB/chat_room.ts');

const port: number = Number(process.env.PORT) || 3000;
const server = createServer(app);
//const {timelog} = require("console");
const io = socketIO(server);

app.use(cors());
chat_user.init();
chat_room.init();

app.post('/RoomList/insert', (req, res) => {
	console.log("insert!!!!!!!!!")
	console.log(req.body.roomInfo)
	chat_room.insert(req.body.roomInfo)
})

app.get('/RoomList/select', (req, res) => {
	res.send(chat_room.select())
})

interface chatObj{
	roomName: any,
	userName: any,
	icon: any
}

io.on("connection", (socket: any) => {
	socket.on("join", async (chat:chatObj) => {
		chat_user.insert(chat.roomName, chat.userName, chat.icon)
		socket.join(chat.roomName);
		io.to(chat.roomName).emit("onConnect", `${chat.userName} 님이 입장했습니다.`);
		const rtn = await chat_user.select()
		io.to(chat.roomName).emit("UserList", rtn)

		socket.on("onSend", (messageItem: {userName:string, msg:string, timeStamp:string}) => {
				io.to(chat.roomName).emit("onReceive", messageItem);
		});

		socket.on("disconnect", async () => {
			chat_user.delete(chat.userName);

			const rtn = await chat_user.select()
			io.to(chat.roomName).emit("UserList", rtn)

			socket.leave(chat.roomName);
			io.to(chat.roomName).emit("onDisconnect", `${chat.userName} 님이 퇴장하셨습니다.`);
		})
	});
});



server.listen(port, () => {
  console.log(`${port}포트 서버 대기 중!`);
});

export default server;