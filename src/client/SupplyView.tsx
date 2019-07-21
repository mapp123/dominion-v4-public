import * as React from 'react';
import createSupplyData from "../createSupplyData";
import {Unsubscribe} from "redux";
import {CardDef} from "../cards/CardDef";
import SupplyButton from "./SupplyButton";
import ClientCardRegistry from "./ClientCardRegisitry";
import {Decision} from "../server/Decision";
import GameView from "./GameView";
import {GainRestrictions} from "../server/GainRestrictions";
interface IProps {
    socket: SocketIOClient.Socket;
    decision: Decision | null;
    gameView: GameView;
}
interface IState {
    data: ReturnType<ReturnType<typeof createSupplyData>['getState']>;
    cardDefs: {[name: string]: typeof CardDef | undefined};
}
export default class SupplyView extends React.Component<IProps, IState> {
    supplyData = createSupplyData();
    unsubscribe: Unsubscribe;
    mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            data: this.supplyData.getState(),
            cardDefs: {}
        };
        this.unsubscribe = this.supplyData.subscribe(() => {
            const newState = this.supplyData.getState();
            if (this.state.data.locations != newState.locations) {
                const lookedUp = Object.keys(this.state.data.locations);
                const needLookUp = Object.entries(newState.locations).filter(([key]) => !lookedUp.includes(key));
                needLookUp.forEach(async ([name, location]) => {
                    const cardDef = await ClientCardRegistry.getInstance().getCard(name, location);
                    this.setState((state) => {
                        return {
                            cardDefs: {
                                ...state.cardDefs,
                                [name]: cardDef
                            }
                        }
                    });
                });
            }
            this.setState({
                data: newState
            });
        });
        this.onSupplyUpdate = this.onSupplyUpdate.bind(this);
        this.props.socket.on('supplyUpdate', this.onSupplyUpdate);
        this.props.socket.emit('fetchSupply', 'onSupplySend');
        this.props.socket.once('onSupplySend', (data) => {
            this.supplyData.state = data;
        });
    }

    onSupplyUpdate(action) {
        this.supplyData.dispatch(action);
    }

    componentDidMount(): void {
        this.mounted = true;
    }

    componentWillUnmount(): void {
        this.unsubscribe();
        this.mounted = false;
        this.props.socket.off('supplyUpdate', this.onSupplyUpdate);
    }

    onClick(name: string, id: string) {
        if (this.props.decision && this.props.decision.decision === 'chooseCardOrBuy') {
            this.props.gameView.respondToDecision<'chooseCardOrBuy'>({
                choice: {
                    name,
                    id
                },
                responseType: 'buy'
            });
        }
        else if (this.props.decision && this.props.decision.decision === 'buy') {
            this.props.gameView.respondToDecision<'buy'>({
                choice: {
                    name,
                    id
                }
            });
        }
        else if (this.props.decision && this.props.decision.decision === 'gain') {
            this.props.gameView.respondToDecision<'gain'>({
                name,
                id
            });
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const restrictions = (!this.props.decision || (this.props.decision.decision !== 'chooseCardOrBuy' && this.props.decision.decision !== 'buy' && this.props.decision.decision !== 'gain')) ?
            null : GainRestrictions.fromJSON(this.props.decision.gainRestrictions);
        const buttons = this.supplyData.piles.map((pile) => {
            let cardName: string;
            let cardId: string;
            if (pile.pile.length === 0 && !pile.identity) {
                return null;
            }
            else if (pile.pile.length === 0) {
                cardName = pile.identity.name;
                cardId = pile.identity.id;
            }
            else {
                cardName = pile.pile[pile.pile.length - 1].name;
                cardId = pile.pile[pile.pile.length - 1].id;
            }
            const def = this.state.cardDefs[cardName];
            if (!def) {
                return null;
            }
            const disabled = restrictions ? !restrictions.validateCard(cardName) : true;
            return (
                <SupplyButton key={pile.identifier} cardName={cardName} cardTypes={def.types} onClick={this.onClick.bind(this, cardName, cardId)} cardText={def.cardText} cost={def.cost} disabled={disabled} supplyAmount={pile.displayCount ? pile.pile.length : undefined}/>
            )
        });
        return (
            <div className="btn-group" style={{flexWrap: "wrap"}}>
                {buttons}
            </div>
        )
    }

}