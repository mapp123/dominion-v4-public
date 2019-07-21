import * as React from 'react';
import HandButton from "./HandButton";
import {Decision} from "../server/Decision";
import GameView from "./GameView";
import Card from "../cards/Card";
interface IProps {
    cards: Card[];
    decision: Decision | null;
    gameView: GameView;
}
export default class HandView extends React.Component<IProps, {}> {
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
    confirmDecision(confirmed) {
        if (this.props.decision && this.props.decision.decision === 'confirm') {
            this.props.gameView.respondToDecision<'confirm'>(confirmed);
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
        return (
            <React.Suspense fallback={<div>Loading...</div>}>
                {this.props.cards.map((card) => <HandButton key={card.id} cardName={card.name} onClick={this.onClick.bind(this, card.name, card.id)}/>)}
            </React.Suspense>
        )
    }
}