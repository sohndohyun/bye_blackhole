import { INestApplicationContext, Logger } from '@nestjs/common';
import { AbstractWsAdapter } from '@nestjs/websockets';
import { MessageMappingProperties } from '@nestjs/websockets/gateway-metadata-explorer';
import { Observable } from 'rxjs';
export declare class WsAdapter extends AbstractWsAdapter {
    protected readonly logger: Logger;
    constructor(appOrHttpServer?: INestApplicationContext | any);
    create(port: number, options?: any & {
        namespace?: string;
        server?: any;
    }): any;
    bindMessageHandlers(client: any, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>): void;
    bindMessageHandler(buffer: any, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>): Observable<any>;
    bindErrorHandler(server: any): any;
    bindClientDisconnect(client: any, callback: Function): void;
}
