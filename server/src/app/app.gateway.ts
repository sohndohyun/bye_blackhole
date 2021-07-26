import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import axios from 'axios';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

	private logger: Logger = new Logger('AppGateway');
	wsClients = [];

	@SubscribeMessage("join")
	async connectSomeone(@MessageBody() data: any, @ConnectedSocket() client) {
		const {roomName, userName, icon} = data
		client.join(roomName)
		this.wsClients.push(client);

		this.logger.log(`${client.id}님이 코드: ${roomName}방에 접속했습니다.`);
		//this.server.to(roomName).emit('onConnect', `${userName}님이 입장했습니다.`);



		client.on("disconnect", async () => {
			client.leave(roomName);
			this.logger.log(`${userName}님이 코드: ${roomName}방에서 퇴장하셨습니다.`);
			//this.server.to(roomName).emit("onDisconnect", `${userName} 님이 퇴장하셨습니다.`);
			for(let i = 0; i < this.wsClients.length; i++){
				if (this.wsClients[i] === client){
					this.wsClients.splice(i, 1);
					i--;
				}
			}
		})
		
	}

	@SubscribeMessage("onSend")
	async messageReceive(@MessageBody() data, @ConnectedSocket() client) {
		const {title, nickname, msg, date} = data
		const user_icon = await axios.post('http://localhost:8080/chat/chatLog', {title:title, id:nickname, content:msg, date:date, sysMsg:false})
		
		this.server.to(title).emit("onReceive", {nickname:nickname, msg:msg, date:date, icon:user_icon.data});
	}

	afterInit(server: Server) {
		this.logger.log('Init');
		//this.db_ChatUser.init();
	}

	handleDisconnect(client: Socket) {
		//this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		//this.logger.log(`Client connected: ${client.id}`);
	}
}