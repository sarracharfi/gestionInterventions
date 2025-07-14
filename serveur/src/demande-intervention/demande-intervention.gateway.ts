import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // A limiter en production (ex: 'http://localhost:3000')
  },
})
export class DemandeInterventionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Gateway WebSocket initialisé');
  }

  handleConnection(client: Socket) {
    console.log(`Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
  }

  sendStatusUpdate(demandeId: string, statut: string, titre: string) {
    this.server.emit('demandeStatutChange', { demandeId, nouveauStatut: statut, titre });
  }
}
