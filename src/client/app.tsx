import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as io from 'socket.io-client';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./Home";
import GameView from "./GameView";
import CreateGameView from "./CreateGameView";
class Application extends React.Component<{}, {}> {
    socket = io();
    constructor(props: {}) {
        super(props);
        // @ts-ignore
        window.socket = this.socket;
        this.state = {
            creatingGame: false
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Router>
                <div style={{marginTop: "7px"}}>
                    <Route path="/" exact component={Home} />
                    <Route path="/createGame/:gameId" component={CreateGameView} />
                    <Route path="/game/:gameId" component={GameView} />
                </div>
            </Router>
        );
    }
}
ReactDOM.render(<Application/>, document.getElementById('app'));