import * as React from 'react';
import type {Decision} from "../server/Decision";
import ConfirmModal from './ConfirmModal';
export default class DefaultDecision extends React.Component<{decision: Decision | null; respondToDecision: (response: any) => any}, {modalOpen: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        };
    }

    onClick(confirm, decision) {
        if (confirm) {
            this.setState({
                modalOpen: true
            });
        }
        else {
            this.props.respondToDecision(decision);
        }
    }

    onChosen(decision, confirmed: boolean) {
        if (confirmed) {
            this.props.respondToDecision(decision);
        }
        this.setState({
            modalOpen: false
        });
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
            <>
                <button style={{fontFamily: "TrajanPro-Bold", fontSize: "20px", padding: "4px 12px"}} className={`btn btn-${className}`} onClick={this.onClick.bind(this, confirm, decision)}>{text}</button>
                <ConfirmModal isOpen={this.state.modalOpen} onChosen={this.onChosen.bind(this, decision)} />
            </>
        );
    }
}