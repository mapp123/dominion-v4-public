import * as React from 'react';
import SupplyView from "./SupplyView";
import {RouteComponentProps} from "react-router";
import SocketManager from "./SocketManager";
import createPlayerData, {PlayerData} from "../createPlayerData";
import {Decision, DecisionResponseType} from "../server/Decision";
import LogView from "./LogView";
import HandView from "./HandView";
import DefaultDecision from "./DefaultDecision";
import CardGenerator from "./CardGenerator/CardGenerator";
import DataViews from "./DataViews";
import {CardImplementation} from "../cards/Card";
import EndOfGameModel from "./EndOfGameModel";
import ChooseUsernameModal from "./ChooseUsernameModal";
interface Params {
    gameId: string;
}
interface IState {
    playersJoined: number;
    playerData: PlayerData;
    decision: Decision | null;
    hoveredCard: CardImplementation | null;
    flashButton?: string;
    mUsername?: string;
    scoreBreakdown?: {[player: string]: {total: number; [card: string]: number}};
    gameResult?: "victory" | "loss";
    forceCloseModal: boolean;
}
export default class GameView extends React.Component<RouteComponentProps<Params>, IState> {
    socket: SocketIOClient.Socket;
    playerData = createPlayerData();
    decisionTimeout: any = null;
    private outOfTurnDecision = new Audio('/audio/outOfTurnDecision.mp3');
    private turnNotification = new Audio('/audio/turnNotification.mp3');
    private endGame = new Audio('/audio/endGame.mp3');
    private win = new Audio('/audio/win.mp3');
    private loss = new Audio('/audio/loss.mp3');
    private firstTurnPlayed = false;
    constructor(props) {
        super(props);
        this.socket = SocketManager.getSocket(this.props.match.params.gameId);
        this.socket.on('error', (e) => {
            if (e === "Invalid namespace") {
                this.props.history.push({
                    pathname: '/'
                });
            }
        });
        this.socket.on('playerCount', (playersJoined) => {
            this.setState({
                playersJoined
            });
        });
        let id: string | null;
        if ((id = sessionStorage.getItem(`game:${this.props.match.params.gameId}`)) != null) {
            this.socket.emit('joinAsPlayer', id, 'joinedAsPlayer');
        }
        else {
            this.socket.emit('joinAsNewPlayer', 'joinedAsPlayer');
        }
        this.socket.on('joinedAsPlayer', (playerId) => {
            sessionStorage.setItem(`game:${this.props.match.params.gameId}`, playerId);
        });
        this.socket.on('decision', (decision: Decision) => {
            window.clearTimeout(this.decisionTimeout);
            if (!this.state.decision && !this.playerData.isMyTurn && this.firstTurnPlayed) {
                this.outOfTurnDecision.play().catch(() => console.log("on mobile"));
            }
            this.setState({
                decision
            });
        });
        this.socket.on('playerStateUpdate', (action) => {
            this.playerData.dispatch(action);
        });
        this.socket.on('playerState', (state) => {
            this.playerData.state = state;
        });
        this.socket.on('endGameSound', (flashTarget) => {
            this.endGame.play().catch(() => console.log("on mobile"));
            this.setState({
                flashButton: flashTarget
            });
        });
        this.socket.on('stopFlash', () => {
            this.setState({
                flashButton: undefined
            });
        });
        this.socket.on('win', (breakdown) => {
            this.win.play().catch(() => console.log("on mobile"));
            this.setState({
                mUsername: breakdown.username,
                scoreBreakdown: breakdown.breakdown,
                gameResult: "victory"
            });
        });
        this.socket.on('loss', (breakdown) => {
            this.loss.play().catch(() => console.log("on mobile"));
            this.setState({
                mUsername: breakdown.username,
                scoreBreakdown: breakdown.breakdown,
                gameResult: "loss"
            });
        });
        this.playerData.subscribe(() => {
            let decisionSet: any = {};
            if (!this.playerData.isMyTurn && this.state.playerData.isMyTurn) {
                decisionSet = {
                    decision: null
                };
            }
            else if (this.playerData.isMyTurn && !this.state.playerData.isMyTurn) {
                this.turnNotification.play().catch(() => console.log("on mobile"));
                this.firstTurnPlayed = true;
            }
            this.setState({
                playerData: this.playerData.getState(),
                ...decisionSet
            });
        });
        this.state = {
            playersJoined: 0,
            playerData: this.playerData.getState(),
            decision: null,
            hoveredCard: null,
            forceCloseModal: false
        };
    }

    startGame() {
        this.socket.emit('startGame');
    }

    respondToDecision<T extends keyof DecisionResponseType = keyof DecisionResponseType>(response: DecisionResponseType[T], decision?: Decision) {
        if (!decision && !this.state.decision) {
            return;
        }
        this.socket.emit('decisionResponse', ((this.state.decision || decision) as Decision).id, response);
        // If we get another decision within 100ms, the screen wont jitter.
        this.decisionTimeout = window.setTimeout(() => this.setState({decision: null}), 100);
    }

    onChoseUsername(username: string) {
        this.respondToDecision(username, this.state.decision!);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-10" style={{height: "calc(100vh - 20px)"}}>
                        <SupplyView flash={this.state.flashButton} socket={this.socket} decision={this.state.decision} gameView={this} setHoveredCard={(card) => this.setState({hoveredCard: card})}/>
                        {this.state.playersJoined > 0 && !this.state.playerData.gameStarted &&
                        <><button className="btn btn-primary dominion-font" onClick={this.startGame.bind(this)}>Start Game</button><br /></>}
                        {this.state.playersJoined > 0 && !this.state.playerData.gameStarted &&
                        <><span className="dominion-font-small">Players In: {this.state.playersJoined}</span><br /></>}
                        <span style={{fontFamily:"TrajanPro-Bold",fontSize:"20px"}}>{this.state.playerData.actions} {this.state.playerData.actions === 1 ? 'Action':'Actions'}, {this.state.playerData.buys} {this.state.playerData.buys === 1 ? 'Buy':'Buys'},<span> </span>
                            <div style={{display:"inline-block",verticalAlign:"-7px"}}>
                                <svg height="1.42857142857em" width="1.42857142857em" viewBox="0 0 100 100">
                                    <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100"/>
                                    <text x={("" + this.state.playerData.money).length > 1 ? "14":"28.5"} y="75" fontSize="70" letterSpacing="-12">{this.state.playerData.money}</text>
                                </svg>
                            </div><br />
                        </span>
                        <DataViews playerData={this.state.playerData} />
                        <span style={{fontFamily:"TrajanPro-Bold"}}>{this.state.decision ? this.state.decision.helperText:'Please wait...'}<br /></span>
                        <div>
                            <div style={{display: "inline-block", width: "250px"}}>
                                <HandView setHoveredCard={(card) => this.setState({hoveredCard: card})} hand={this.state.playerData.hand} decision={this.state.decision} gameView={this}/>
                            </div>
                            <div style={{display: "inline-block", position: "absolute"}}>
                                <span>
                                    <DefaultDecision decision={this.state.decision} respondToDecision={this.respondToDecision.bind(this)} />
                                    <br />
                                </span>
                            </div>
                        </div>
                        <div id="cardId" style={{height: "50%", position: "absolute", bottom: 0, right: 0}}>
                            {this.state.hoveredCard && <CardGenerator cardArtUrl={this.state.hoveredCard.cardArt} cardName={this.state.hoveredCard.cardName} cardTypes={this.state.hoveredCard.types} costs={this.state.hoveredCard.cost} description={this.state.hoveredCard.cardText} smallDescription={this.state.hoveredCard.smallText} />}
                        </div>
                    </div>
                    <div className="col-sm-2" style={{height:"calc(100vh - 7px)",overflowY:"scroll"}}>
                        <LogView socket={this.socket} />
                    </div>
                </div>
                <EndOfGameModel close={() => this.setState({forceCloseModal: true})} visible={!this.state.forceCloseModal && !!this.state.gameResult} type={this.state.gameResult || "victory"} points={this.state.scoreBreakdown?.[this.state.mUsername || ""]?.total || 0} breakdown={this.state.scoreBreakdown || {}}/>
                <ChooseUsernameModal onChosen={this.onChoseUsername.bind(this)} isOpen={this.state.decision?.decision === 'chooseUsername'} />
            </div>
        );
    }
}