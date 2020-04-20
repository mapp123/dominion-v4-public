import * as React from 'react';
import {PlayerData} from "../createPlayerData";

interface IProps {
    tokens: PlayerData["tokens"];
    tokenViews: PlayerData["tokenViews"];
}
export default class TokenView extends React.Component<IProps, {}> {
    static tokenNames = {
        journeyToken: "Journey Token",
        extraCard: "+1 Card",
        extraMoney: "+$1",
        extraBuy: "+1 Buy",
        extraAction: "+1 Action"
    }
    formatValue(value) {
        if (value === 'UP') {
            return 'Up';
        }
        else if (value === 'DOWN') {
            return 'Down';
        }
        else if (value == null) {
            return 'Not Set';
        }
        return value;
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return this.props.tokenViews.map((token) => {
            return <p key={token} style={{marginBottom: "1px"}} className="dominion-font-small">{TokenView.tokenNames[token] || token}: {this.formatValue(this.props.tokens[token])}</p>;
        });
    }
}