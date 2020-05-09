import * as React from 'react';
import HandButton from "./HandButton";
import type {Decision} from "../server/Decision";
import type GameView from "./GameView";
import type {default as Card, CardImplementation} from "../cards/Card";
import Reorder = require('react-reorder');
import ClientCardRegistry from "./ClientCardRegistry";
import type {GameData} from "../createGameData";
interface IProps {
    hand: Card[];
    decision: Decision | null;
    gameView: GameView;
    setHoveredCard: (card: CardImplementation| null) => any;
    gameData: GameData;
}
export default class HandView extends React.Component<IProps, {}> {
    list: Card[] = [];
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClick(name: string, id: string, way?: string) {
        if (way) {
            this.props.gameView.interrupt('way', {
                cardId: id,
                asWay: way
            });
        }
        if (this.props.decision && this.props.decision.decision === 'chooseCardOrBuy') {
            this.props.gameView.respondToDecision<'chooseCardOrBuy'>({
                responseType: 'playCard',
                choice: {
                    name,
                    id
                }
            });
        }
        if (this.props.decision && this.props.decision.decision === 'chooseCard') {
            this.props.gameView.respondToDecision<'chooseCard'>({
                name,
                id
            });
        }
    }
    chooseOption(option) {
        this.props.gameView.respondToDecision<'chooseOption'>({
            choice: option
        });
    }
    confirmDecision(confirmed) {
        if (this.props.decision && this.props.decision.decision === 'confirm') {
            this.props.gameView.respondToDecision<'confirm'>(confirmed);
        }
    }
    submitReorder() {
        if (this.props.decision && this.props.decision.decision === 'reorder') {
            this.props.gameView.respondToDecision<'reorder'>({
                order: this.props.decision.cards.sort((a, b) => {
                    return this.list.findIndex((c) => c.id === a.id) - this.list.findIndex((c) => c.id === b.id);
                })
            });
        }
    }
    onHover(card) {
        ClientCardRegistry.getInstance().getCard(card).then((a) => {
            this.props.setHoveredCard(a);
        });
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        let decision: React.ReactElement<any> | React.ReactNodeArray | null = null;
        if (this.props.decision && this.props.decision.decision === 'confirm') {
            decision = (
                <>
                    <button onClick={() => this.confirmDecision(true)} className="btn btn-info dominion-font" style={{margin: "4px"}}>Yes</button>
                    <button onClick={() => this.confirmDecision(false)} className="btn btn-info dominion-font" style={{margin: "4px"}}>No</button>
                </>
            );
        }
        if (this.props.decision && this.props.decision.decision === 'chooseOption') {
            decision = this.props.decision.options.map((a, i) => {
                return (
                    <button key={i} onClick={() => this.chooseOption(a)} className="btn btn-info dominion-font" style={{margin: "4px"}}>{a}</button>
                );
            });
        }
        if (this.props.decision && this.props.decision.decision === 'reorder') {
            decision = (
                <>
                    <button className="btn btn-info dominion-font" style={{margin: "4px 0"}}>{this.props.decision.topString}</button>
                    <Reorder
                        itemKey='id'
                        lock={'horizontal'}
                        holdTime={0}
                        list={this.props.decision.cards.map((card) => {
                            return {
                                cardName: card.name,
                                onClick: null,
                                id: card.id,
                                name: card.name,
                                types: card.types
                            };
                        })}
                        callback={(a,b,c,d,reorderedArray) => {
                            this.list = reorderedArray;
                        }}
                        template={({item}) => <HandButton {...item}/>}
                    />
                    <button className="btn btn-info dominion-font" style={{margin: "4px 0"}}>{this.props.decision.bottomString}</button>
                    <button className="btn btn-success dominion-font" style={{margin: "4px 0"}} onClick={this.submitReorder.bind(this)}>Done</button>
                </>
            );
        }
        if (this.props.decision && this.props.decision.decision === 'chooseCard' && this.props.decision.sourceIsHand !== true) {
            decision = this.props.decision.source.map((card) => <HandButton id={card.id} onHover={this.onHover.bind(this)} key={card.id} cardName={card.name} types={card.types || []} onClick={this.onClick.bind(this, card.name, card.id)}/>);
        }
        let extras: Card[] = [];
        if (this.props.decision && this.props.decision.decision === 'chooseCard' && this.props.decision.sourceIsHand) {
            extras = this.props.decision.source.filter((a) => !this.props.hand.some((b) => a.id === b.id));
        }
        return (
            <React.Suspense fallback={<div>Loading...</div>}>
                {decision}
                {decision && <><hr style={{borderColor: "black", borderWidth: "3px", width: "100%"}} /><span>Your Hand:</span><br /></>}
                {[...this.props.hand, ...extras].map((card) => <HandButton withWays={decision ? undefined : ((this.props.decision as any)?.waysAvailable || this.props.decision?.decision === "chooseCardOrBuy") ? this.props.gameData.ways.map((a) => a.name) : undefined} id={card.id} onHover={this.onHover.bind(this)} key={card.id} cardName={card.name} types={card.types || []} onClick={decision ? () => {} : this.onClick.bind(this, card.name, card.id)}/>)}
            </React.Suspense>
        );
    }
}
