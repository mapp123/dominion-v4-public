import 'source-map-support/register';
import * as express from 'express';
import * as io from 'socket.io';
import {createServer} from "http";
import {resolve} from "path";
import Game from "./Game";
import CardRegistry from "../cards/CardRegistry";
import {Socket} from "socket.io";
const app = express();
app.use(express.static(resolve(__dirname, "../..", "dist")));
const server = createServer(app);
const sockets = io(server);
const games: {[key: string]: Game} = {};
const shortcuts: {[key: string]: string} = {};
const listeners: Map<Socket, string> = new Map<Socket, string>();
sockets.on('connection', (socket) => {
    socket.on('createGame', (returnTo) => {
        const game = new Game(sockets);
        games[game.id] = game;
        socket.emit(returnTo, game.id);
    });
    socket.on('setShortcut', (gameId, shortcut) => {
        shortcuts[shortcut] = gameId;
        for (let [s, returnTo] of listeners) {
            s.emit(returnTo, [[shortcut, gameId]]);
        }
    });
    socket.on('getShortcut', (shortcut, returnTo) => {
        if (shortcuts[shortcut]) {
            socket.emit(returnTo, shortcuts[shortcut]);
        }
    });
    socket.on('listenForShortcuts', (returnTo) => {
        socket.emit(returnTo, Object.entries(shortcuts));
        listeners.set(socket, returnTo);
    });
    socket.on('stopListeningForShortcuts', () => {
        listeners.delete(socket);
    });
    socket.on('disconnect', () => {
        listeners.delete(socket);
    });
    socket.on('getRandomizable', (returnTo) => {
        socket.emit(returnTo, CardRegistry.getInstance().getRandomizable());
    });
});
app.use((req, res) => res.sendFile(resolve(__dirname, "../..", "dist/index.html")));
server.listen(process.env.PORT || 3000);