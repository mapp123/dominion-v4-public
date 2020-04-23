import * as React from 'react';
import {CardGeneratorWrapped} from "./CardGenerator";
import type { RouteComponentProps } from 'react-router';
import ClientCardRegistry from "../ClientCardRegistry";
import type {CardImplementation} from "../../cards/Card";

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
                <div style={{width: "100vw", height: "calc(100vh - 7px)", display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "column", flex: "1 1"}}>
                        <CardGeneratorWrapped card={this.state.card}
                            factorOverrides={(this.state.r === this.state.g) && (this.state.g === this.state.b) && (this.state.b === 1) ? undefined : [this.state.r, this.state.g, this.state.b]} />
                    </div>
                    <input type="range" min="0" max="1.5" value={this.state.r} step="0.05" onChange={this.updateState.bind(this, 'r')} /><span>{this.state.r}</span><br />
                    <input type="range" min="0" max="1.5" value={this.state.g} step="0.05" onChange={this.updateState.bind(this, 'g')} /><span>{this.state.g}</span><br />
                    <input type="range" min="0" max="1.5" value={this.state.b} step="0.05" onChange={this.updateState.bind(this, 'b')} /><span>{this.state.b}</span><br />
                </div>
            </>
        );
    }
}