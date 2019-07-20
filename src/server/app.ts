import 'source-map-support/register';
import * as express from 'express';
import * as io from 'socket.io';
import {createServer} from "http";
import {resolve} from "path";
import Game from "./Game";
import CardRegistry from "../cards/CardRegistry";
const app = express();
app.use(express.static(resolve(__dirname, "../..", "dist")));
const server = createServer(app);
const sockets = io(server);
const games: {[key: string]: Game} = {};
sockets.on('connection', (socket) => {
    socket.on('createGame', (returnTo) => {
        const game = new Game(sockets);
        games[game.id] = game;
        socket.emit(returnTo, game.id);
    });
    socket.on('getRandomizable', (returnTo) => {
        socket.emit(returnTo, CardRegistry.getInstance().getRandomizable());
    })
});
app.use((req, res) => res.sendFile(resolve(__dirname, "../..", "dist/index.html")));
server.listen(process.env.PORT || 3000);