import * as React from 'react';
import {Decision} from "../server/Decision";
export default class DefaultDecision extends React.Component<{decision: Decision | null; respondToDecision: (response: any) => any}, {}> {
    onClick(confirm, decision) {
        if (!confirm || window.confirm("Are you sure?")) {
            this.props.respondToDecision(decision);
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (!this.props.decision) {
            return null;
        }
        let text = "";
        let className = "";
        let decision: any = {};
        let confirm = false;
        switch (this.props.decision.decision) {
            case "buy":
                text = "End Turn";
                className = "danger";
                decision = {
                    choice: {
                        name: 'End Turn',
                        id: ''
                    }
                };
                confirm = true;
                break;
            case "chooseCardOrBuy":
                text = "End Turn";
                className = "danger";
                decision = {
                    responseType: 'buy',
                    choice: {
                        name: 'End Turn',
                        id: ''
                    }
                };
                confirm = true;
                break;
            case "gain":
                if (this.props.decision.optional) {
                    text = "Gain Nothing";
                    className = "info";
                    decision = {
                        name: 'Gain Nothing',
                        id: ''
                    };
                }
                else {
                    return null;
                }
                break;
            default:
                return null;
        }
        return (
            <button style={{fontFamily: "TrajanPro-Bold", fontSize: "20px", padding: "4px 12px"}} className={`btn btn-${className}`} onClick={this.onClick.bind(this, confirm, decision)}>{text}</button>
        );
    }
}