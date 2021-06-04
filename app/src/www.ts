import app from "./app";
import {createServer} from "http";

const port: number = Number(process.env.PORT) || 3000;
const server = createServer(app);


const socketIO = require("socket.io");
//const {timelog} = require("console");
const io = socketIO(server);
const cors = require("cors");
app.use(cors());


interface join_obj {
	room:string,
	user:string
}

io.on("connection", (socket: any) => {
	socket.on("join", ({room, user}:join_obj) => {
		socket.join(room);
		io.to(room).emit("onConnect", '${user} 님이 입장했습니다.');
		socket.on("onSend", (messageItem: any) => {
			io.to(room).emit("onReceive", messageItem);
		});
		socket.on("disconnect", () => {
			socket.leave(room);
			io.to(room).emit("onDisconnect", '${user} 님이 퇴장하셨습니다.');
		})
	});
});




server.listen(port, () => {
  console.log(`${port}포트 서버 대기 중!`);
});

export default server;