import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from '../service/message.service';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    message: {
      senderId: string;
      receiverId: string;
      content: string;
    },
  ) {
    const savedMessage = await this.messageService.sendMessage(
      message.senderId,
      message.receiverId,
      message.content,
    );
    this.server.emit('message', savedMessage);
  }
}
