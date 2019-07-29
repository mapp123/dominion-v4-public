import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import SocketManager from "./SocketManager";
export default class Home extends React.Component<RouteComponentProps, {shortcuts: Array<[string, string]>}> {
    socket = SocketManager.getGlobalSocket();
    constructor(props) {
        super(props);
        this.state = {
            shortcuts: []
        };
        this.socket.emit('listenForShortcuts', 'onShortcut');
        this.socket.on('onShortcut', (shortcuts) => {
            this.setState((state) => {
                return {
                    ...state,
                    shortcuts: [...state.shortcuts, ...shortcuts]
                };
            });
        });
    }

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
                <button className="btn btn-success" onClick={this.createGame.bind(this)}>Create Game</button><br />
                {this.state.shortcuts.map(([shortcut, gameId]) => {
                    return (
                        <><Link to={`/game/${gameId}`}>{shortcut}</Link><br /></>
                    );
                })}
            </div>
        );
    }
}