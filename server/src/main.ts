import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors();
	app.useStaticAssets(join(__dirname, '../../client/build'));
	app.useWebSocketAdapter(new WsAdapter(app))
	app.useWebSocketAdapter(new IoAdapter(app))
	await app.listen(8080);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
