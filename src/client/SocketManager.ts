import * as io from 'socket.io-client';
export default class SocketManager {
    private static sockets: Map<String, SocketIOClient.Socket> = new Map();
    private static socket: SocketIOClient.Socket;
    static getSocket(id: string) {
        if (!this.sockets.has(id)) {
            this.sockets.set(id, io(`/${id}`));
        }
        return this.sockets.get(id) as SocketIOClient.Socket;
    }
    static getGlobalSocket() {
        if (!this.socket) {
            this.socket = io();
        }
        return this.socket;
    }
}