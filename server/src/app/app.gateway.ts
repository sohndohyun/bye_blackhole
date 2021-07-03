import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server} from 'socket.io';
import axios from 'axios';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('AppGateway');
	db_ChatUser = require('../DB/chat_user')
	wsClients = [];

	@SubscribeMessage("join")
	async connectSomeone(@MessageBody() data: any, @ConnectedSocket() client) {
		const {roomName, userName, icon} = data
		client.join(roomName)
		this.logger.log(`${userName}님이 코드: ${roomName}방에 접속했습니다.`);
		this.server.to(roomName).emit('onConnect', `${userName}님이 입장했습니다.`);
		this.wsClients.push(client);

		this.db_ChatUser.insert(roomName, userName, icon)
		const rtn = await this.db_ChatUser.select()
		this.server.to(roomName).emit("UserList", rtn)

		client.on("onSend", (messageItem: {userName:string, msg:string, timeStamp:string}) => {
			this.server.to(roomName).emit("onReceive", messageItem);
		});

		client.on("disconnect", async () => {
			this.db_ChatUser.delete(userName);
			const rtn = await this.db_ChatUser.select()
			this.server.to(roomName).emit("UserList", rtn)

			client.leave(roomName);
			this.logger.log(`${userName}님이 코드: ${roomName}방에서 퇴장하셨습니다.`);
			this.server.to(roomName).emit("onDisconnect", `${userName} 님이 퇴장하셨습니다.`);
			for(let i = 0; i < this.wsClients.length; i++){
				if (this.wsClients[i] === client){
					this.wsClients.splice(i, 1);
					i--;
				}
			}
			await axios.patch('http://localhost:8080/RoomList/decNum/' + roomName)
			const getRoomNum = await axios.get('http://localhost:8080/RoomList/' + roomName)
			if (getRoomNum.data.num < 1)
				await axios.delete('http://localhost:8080/RoomList/' + roomName)
		})
	}

	afterInit(server: Server) {
		this.logger.log('Init');
		this.db_ChatUser.init();
	}

	handleDisconnect(client: Socket) {
	 this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}