import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @SubscribeMessage('client_ready')
  async handleClientReady(): Promise<void> {
    console.log('Client ready!');
  }
}
