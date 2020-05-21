import * as React from 'react';
import SocketManager from "./SocketManager";
import type { RouteComponentProps } from 'react-router';
interface IState {
    cards: string[];
    landscapes: Array<[string, string]>;
    shortcut: string;
    ais: string;
    randomizerSetsChosen: {[set: string]: boolean};
    params: {[name: string]: string};
}
export default class CreateGameView extends React.Component<RouteComponentProps<{gameId: string}>, IState> {
    socket = SocketManager.getSocket(this.props.match.params.gameId);
    globalSocket = SocketManager.getGlobalSocket();
    constructor(props) {
        super(props);
        this.state = {
            cards: Array(10).fill(""),
            landscapes: [],
            shortcut: "",
            ais: "0",
            randomizerSetsChosen: {},
            params: {}
        };
        this.socket.on('error', (e) => {
            if (e === 'Invalid namespace') {
                this.props.history.push({
                    pathname: '/'
                });
            }
        });
        this.globalSocket.emit('getSets', 'sets');
        this.globalSocket.once('sets', (sets) => {
            this.setState({
                randomizerSetsChosen: sets.reduce((sets, key) => ({...sets, [key]: false}), {})
            });
        });
    }
    updateState(path: string[], e: any) {
        const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState((state) => {
            let top = state;
            path.slice(0, -1).forEach((key) => {
                if (Array.isArray(top[key])) {
                    top[key] = [...top[key]];
                }
                else {
                    top[key] = {...top[key]};
                }
                top = top[key];
            });
            top[path.slice(-1)[0]] = newValue;
            return state;
        });
    }
    submit() {
        if (this.state.shortcut) {
            this.globalSocket.emit('setShortcut', this.props.match.params.gameId, this.state.shortcut);
        }
        if (!isNaN(parseInt(this.state.ais))) {
            this.socket.emit('setAIPlayers', parseInt(this.state.ais));
        }
        else return;
        this.socket.emit('setCards', [...this.state.cards, ...this.state.landscapes.map((a) => a[1])], this.state.params, 'gameReady');
        this.socket.once('gameReady', (result, reason) => {
            if (result === 'proceedToGame') {
                this.props.history.push({
                    pathname: `/game/${this.props.match.params.gameId}`
                });
            }
            else if (result === 'unsatisfiedParams') {
                this.setState((state) => ({
                    params: {...state.params, ...Object.fromEntries(reason.map((a) => [a, ""]))}
                }));
            }
        });
    }
    randomize() {
        this.socket.emit('randomize', {
            sets: Object.entries(this.state.randomizerSetsChosen).filter(([, value]) => value).map((a) => a[0]),
            landscapes: this.state.landscapes.map((a) => a[0]),
            params: this.state.params,
            prechosen: this.state.cards.every((a) => a != "") ? [] : this.state.cards.filter((a) => a !== "")
        }, 'randomized');
        this.socket.once('randomized', ({cards, landscapes, params}) => {
            this.setState({
                cards,
                landscapes,
                params
            });
        });
    }
    addLandscape(type) {
        this.setState((state) => ({
            landscapes: ([...state.landscapes, [type, '???']] as Array<[string, string]>).sort((a, b) => a[0].localeCompare(b[0]))
        }));
    }
    removeLandscape(index) {
        this.setState((state) => ({
            landscapes: state.landscapes.filter((_,i) => i !== index)
        }));
    }
    createTextInput(friendlyName, path, addRemove = false) {
        let input = (<input className="form-control" value={path.reduce((top, key) => top[key], this.state)} onChange={this.updateState.bind(this, path)} />);
        if (addRemove) {
            input = (
                <div className="input-group">
                    {input}
                    <div className="input-group-append">
                        <button className="btn btn-danger" type="button" onClick={this.removeLandscape.bind(this, path[1])}>Remove</button>
                    </div>
                </div>
            );
        }
        return (
            <div className="form-group" key={path.join(".")}>
                <label>{friendlyName}</label>
                {input}
            </div>
        );
    }
    createCheckboxInput(friendlyName, path) {
        return (
            <div className="form-group form-check" key={path.join(".")}>
                <input type="checkbox" className="form-check-input" checked={path.reduce((top, key) => top[key], this.state)} onChange={this.updateState.bind(this, path)} />
                <label className="form-check-label">{friendlyName}</label>
            </div>
        );
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="container-fluid">
                {this.createTextInput('Shortcut', ['shortcut'])}
                {this.createTextInput('AI Players', ['ais'])}
                <div className="card">
                    <div className="card-header">
                        <span className="middle-align-text">Cards</span>
                        <button className="btn btn-primary float-right" onClick={this.submit.bind(this)}>Create Game</button>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-9">
                                {this.state.cards.map((card, i) => {
                                    const ret = [this.createTextInput(`Card ${i+1}`, ['cards', i])];
                                    if (Object.keys(this.state.params).some((a) => a.startsWith(card))) {
                                        ret.push(...Object.keys(this.state.params).filter((a) => a.startsWith(card)).map((paramName) => {
                                            return this.createTextInput(`${paramName.split("_")[1]} (${card})`, ['params', paramName]);
                                        }));
                                    }
                                    return ret;
                                })}
                                {this.state.landscapes.map(([type, card], i) => {
                                    const ret = [this.createTextInput(`${type === 'any' ? 'Any Landscape' : type.slice(0, 1).toUpperCase() + type.slice(1)}`, ['landscapes', i, 1], true)];
                                    if (Object.keys(this.state.params).some((a) => a.startsWith(card))) {
                                        ret.push(...Object.keys(this.state.params).filter((a) => a.startsWith(card)).map((paramName) => {
                                            return this.createTextInput(`${paramName.split("_")[1]} (${card})`, ['params', paramName]);
                                        }));
                                    }
                                    return ret;
                                })}
                            </div>
                            <div className="col-xs-12 col-sm-3">
                                <div>
                                    <label>Randomize by Set</label>
                                </div>
                                {Object.keys(this.state.randomizerSetsChosen).map((set) =>
                                    this.createCheckboxInput(set.slice(0, 1).toUpperCase() + set.replace(/([A-Z])/g, ' $1').slice(1), ['randomizerSetsChosen', set])
                                )}
                                <div>
                                    <button className="btn btn-success" onClick={this.randomize.bind(this)}>Randomize</button>
                                </div>
                                <div style={{paddingTop: "7px"}}>
                                    <div className="btn-group">
                                        <button className="btn btn-dark" onClick={this.addLandscape.bind(this, 'any')}>Add Random Landscape</button>
                                        <button className="btn btn-dark" onClick={this.addLandscape.bind(this, 'event')}>Add Event</button>
                                    </div>
                                    <div className="btn-group">
                                        <button className="btn way-button-override" onClick={this.addLandscape.bind(this, 'way')}>Add Way</button>
                                        <button className="btn project-button-override" onClick={this.addLandscape.bind(this, 'project')}>Add Project</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}