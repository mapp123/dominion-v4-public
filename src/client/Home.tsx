import * as React from 'react';
import * as io from "socket.io-client";
import { RouteComponentProps } from 'react-router-dom';
import SocketManager from "./SocketManager";
export default class Home extends React.Component<RouteComponentProps, {}> {
    socket = SocketManager.getGlobalSocket();
    createGame() {
        this.socket.emit('createGame', 'onGameCreate');
        this.socket.once('onGameCreate', (gameId) => {
            this.props.history.push({
                pathname: `/createGame/${gameId}`
            });
            /*this.gameSocket = io(`/${gameId}`);
            this.gameSocket.on('playerState', (d) => {
                this.playerData.state = d;
            });
            this.gameSocket.on('playerStateUpdate', (action) => {
                this.playerData.dispatch(action);
            });
            this.gameSocket.emit('joinAsNewPlayer');
            // @ts-ignore
            window.gameSocket = this.gameSocket;*/
        });
    }
    render() {
        return (
            <div className="container-fluid">
                <button className="btn btn-success" onClick={this.createGame.bind(this)}>Create Game</button>
            </div>
        );
    }
}