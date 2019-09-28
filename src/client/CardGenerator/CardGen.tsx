import * as React from 'react';
import CardGenerator from "./CardGenerator";
import { RouteComponentProps } from 'react-router';
import ClientCardRegistry from "../ClientCardRegistry";
import {CardDef} from "../../cards/CardDef";

export default class CardGen extends React.Component<RouteComponentProps<{card: string}>, {card: typeof CardDef | null}> {
    constructor(props) {
        super(props);
        this.state = {
            card: null
        };
        this.componentWillReceiveProps(props);
    }

    componentWillReceiveProps(nextProps: Readonly<RouteComponentProps<{ card: string }>>): void {
        console.log(`getting card ${nextProps.match.params.card}`);
        ClientCardRegistry.getInstance().getCard(nextProps.match.params.card.split("/").slice(-1)[0], nextProps.match.params.card).then((card) => {
            console.log(`got card ${nextProps.match.params.card}`);
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
            <div style={{width: "100vw", height: "100vh"}}>
                <CardGenerator cardArtUrl={this.state.card.cardArt}
                    cardName={this.state.card.cardName}
                    cardTypes={this.state.card.types}
                    costs={this.state.card.cost}
                    smallDescription={false}
                    description={this.state.card.cardText} />
            </div>
        );
    }
}