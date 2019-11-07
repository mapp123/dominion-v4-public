import * as React from 'react';
import CardGenerator from "./CardGenerator";
import { RouteComponentProps } from 'react-router';
import ClientCardRegistry from "../ClientCardRegistry";
import {CardImplementation} from "../../cards/Card";

export default class CardGen extends React.Component<RouteComponentProps<{card: string}>, {card: CardImplementation | null; r: number; g: number; b: number}> {
    constructor(props) {
        super(props);
        this.state = {
            card: null,
            r: 1,
            g: 1,
            b: 1
        };
    }

    updateState(key, e) {
        this.setState({
            [key]: parseFloat(e.target.value)
        } as any);
    }

    componentDidMount(): void {
        this.grabCard();
    }

    componentDidUpdate(prevProps: Readonly<RouteComponentProps<{ card: string }>>): void {
        if (this.props !== prevProps) {
            this.grabCard();
        }
    }

    grabCard() {
        console.log(`getting card ${this.props.match.params.card}`);
        ClientCardRegistry.getInstance().getCard(this.props.match.params.card.split("/").slice(-1)[0], this.props.match.params.card).then((card) => {
            console.log(`got card ${this.props.match.params.card}`);
            this.setState({
                card
            });
        });
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.state.card === null) {
            return null;
        }
        return (
            <>
                <div style={{width: "100vw", height: "100vh"}}>
                    <CardGenerator cardArtUrl={this.state.card.cardArt}
                        cardName={this.state.card.cardName}
                        cardTypes={this.state.card.types}
                        costs={this.state.card.cost}
                        smallDescription={false}
                        description={this.state.card.cardText}
                        factorOverrides={(this.state.r === this.state.g) && (this.state.g === this.state.b) && (this.state.b === 1) ? undefined : [this.state.r, this.state.g, this.state.b]}
                        descriptionFontStart={this.state.card.descriptionSize}
                        typeFontStart={this.state.card.typelineSize}/>
                </div>
                <input type="range" min="0" max="1.5" value={this.state.r} step="0.05" onChange={this.updateState.bind(this, 'r')} /><span>{this.state.r}</span><br />
                <input type="range" min="0" max="1.5" value={this.state.g} step="0.05" onChange={this.updateState.bind(this, 'g')} /><span>{this.state.g}</span><br />
                <input type="range" min="0" max="1.5" value={this.state.b} step="0.05" onChange={this.updateState.bind(this, 'b')} /><span>{this.state.b}</span><br />
            </>
        );
    }
}