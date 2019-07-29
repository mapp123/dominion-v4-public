import * as React from 'react';
import SocketManager from "./SocketManager";
import { RouteComponentProps } from 'react-router';
import shuffle from "../server/util/shuffle";
interface IState {
    cards: string[];
    shortcut: string;
    randomizable: {[set: string]: string[]};
    randomizerSetsChosen: {[set: string]: boolean};
}
export default class CreateGameView extends React.Component<RouteComponentProps<{gameId: string}>, IState> {
    socket = SocketManager.getSocket(this.props.match.params.gameId);
    globalSocket = SocketManager.getGlobalSocket();
    constructor(props) {
        super(props);
        this.state = {
            cards: Array(10).fill(""),
            shortcut: "",
            randomizable: {},
            randomizerSetsChosen: {}
        };
        this.socket.on('error', (e) => {
            if (e === 'Invalid namespace') {
                this.props.history.push({
                    pathname: '/'
                })
            }
        });
        this.globalSocket.emit('getRandomizable', 'randomizable');
        this.globalSocket.once('randomizable', (randomizable) => {
            this.setState({
                randomizable,
                randomizerSetsChosen: Object.keys(randomizable).reduce((sets, key) => ({...sets, [key]: false}), {})
            });
        });
    }
    updateState(path: string[], e: any) {
        const newValue = e.target.value;
        this.setState((state) => {
            let top = state;
            path.slice(0, -1).forEach((key) => {
                if (Array.isArray(top[key])) {
                    top[key] = [...top[key]];
                }
                else {
                    top[key] = {...top[key]}
                }
                top = top[key];
            });
            top[path.slice(-1)[0]] = newValue;
            return state;
        });
    }
    submit() {
        this.socket.emit('setCards', this.state.cards);
        if (this.state.shortcut) {
            this.globalSocket.emit('setShortcut', this.props.match.params.gameId, this.state.shortcut);
        }
        this.props.history.push({
            pathname: `/game/${this.props.match.params.gameId}`
        });
    }
    randomize() {
        const pool: string[] = [];
        Object.keys(this.state.randomizerSetsChosen).forEach((set) => {
            if (this.state.randomizerSetsChosen[set]) {
                pool.push(...this.state.randomizable[set]);
            }
        });
        shuffle(pool);
        this.setState({
            cards: pool.slice(0, 10)
        })
    }
    createTextInput(friendlyName, path) {
        return (
            <div className="form-group" key={path.join(".")}>
                <label>{friendlyName}</label>
                <input className="form-control" value={path.reduce((top, key) => top[key], this.state)} onChange={this.updateState.bind(this, path)} />
            </div>
        )
    }
    createCheckboxInput(friendlyName, path) {
        return (
            <div className="form-group form-check" key={path.join(".")}>
                <input type="checkbox" className="form-check-input" value={path.reduce((top, key) => top[key], this.state)} onChange={this.updateState.bind(this, path)} />
                <label className="form-check-label">{friendlyName}</label>
            </div>
        )
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="container-fluid">
                {this.createTextInput('Shortcut', ['shortcut'])}
                <div className="card">
                    <div className="card-header">
                        <span className="middle-align-text">Cards</span>
                        <button className="btn btn-primary float-right" onClick={this.submit.bind(this)}>Create Game</button>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-9">
                                {this.state.cards.map((card, i) => this.createTextInput(`Card ${i+1}`, ['cards', i]))}
                            </div>
                            <div className="col-xs-12 col-sm-3">
                                <div>
                                    <label>Randomize by Set</label>
                                </div>
                                {Object.keys(this.state.randomizerSetsChosen).map((set) =>
                                    this.createCheckboxInput(set.slice(0, 1).toUpperCase() + set.slice(1), ['randomizerSetsChosen', set])
                                )}
                                <button className="btn btn-success" onClick={this.randomize.bind(this)}>Randomize</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}