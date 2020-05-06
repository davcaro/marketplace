import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: SocketIOClient.Socket;

  constructor() {}

  getSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  setupConnection(token: string): void {
    this.socket = io(environment.socketUrl, { query: { token } });
  }

  closeConnection(): void {
    this.socket.close();
  }
}
