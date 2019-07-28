import * as React from 'react';
import HandButton from "./HandButton";
import {Decision} from "../server/Decision";
import GameView from "./GameView";
import Card from "../cards/Card";
import Reorder = require('react-reorder');
interface IProps {
    cards: Card[];
    decision: Decision | null;
    gameView: GameView;
}
interface IState {

}
export default class HandView extends React.Component<IProps, IState> {
    list: Array<Card> = [];
    constructor(props) {
        super(props);
        this.state = {}
    }

    onClick(name: string, id: string) {
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
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.props.decision && this.props.decision.decision === 'confirm') {
            return (
                <>
                    <button onClick={() => this.confirmDecision(true)} className="btn btn-info dominion-font" style={{margin: "4px"}}>Yes</button>
                    <button onClick={() => this.confirmDecision(false)} className="btn btn-info dominion-font" style={{margin: "4px"}}>No</button>
                </>
            )
        }
        if (this.props.decision && this.props.decision.decision === 'chooseOption') {
            return this.props.decision.options.map((a) => {
                return (
                    <button onClick={() => this.chooseOption(a)} className="btn btn-info dominion-font" style={{margin: "4px"}}>{a}</button>
                )
            })
        }
        if (this.props.decision && this.props.decision.decision === 'reorder') {
            return (
                <>
                    <button className="btn btn-info dominion-font" style={{margin: "4px 0"}}>{this.props.decision.topString}</button>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Reorder
                            itemKey='id'
                            lock={'horizontal'}
                            holdTime={0}
                            list={this.props.decision.cards.map((card) => {
                                return {
                                    cardName: card.name,
                                    onClick: null,
                                    id: card.id,
                                    name: card.name
                                }
                            })}
                            callback={(a,b,c,d,reorderedArray) => {
                                this.list = reorderedArray;
                            }}
                            template={HandButton}
                        />
                    </React.Suspense>
                    <button className="btn btn-info dominion-font" style={{margin: "4px 0"}}>{this.props.decision.bottomString}</button>
                    <button className="btn btn-success dominion-font" style={{margin: "4px 0"}} onClick={this.submitReorder.bind(this)}>Done</button>
                </>
            )
        }
        return (
            <React.Suspense fallback={<div>Loading...</div>}>
                {this.props.cards.map((card) => <HandButton key={card.id} cardName={card.name} onClick={this.onClick.bind(this, card.name, card.id)}/>)}
            </React.Suspense>
        )
    }
}
