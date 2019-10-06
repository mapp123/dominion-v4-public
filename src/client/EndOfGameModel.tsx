import * as React from 'react';
import * as Modal from 'react-modal';
interface IProps {
    visible: boolean;
    type: "victory" | "loss";
    points: number;
    breakdown: {[player: string]: {total: number; [card: string]: number}};
    close: () => any;
}
export default class EndOfGameModel extends React.Component<IProps, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (!this.props.visible) return null;
        const victory = this.props.type === "victory";
        return (
            <Modal isOpen={this.props.visible} overlayClassName="modal-overlay" className={victory ? "modal-win": "modal-loss"}>
                <div style={{position: "relative", top: 0, left: 0, right: 0, bottom: 0, textAlign: "center", zIndex: 2, padding: "20px", display: "flex", flexDirection: "column", height: "100%"}}>
                    <h1 className="dominion-font" style={{fontSize: "10em", color: victory ? "#005200": "#770000"}}>{victory ? "Victory!" : "Loss!"}</h1>
                    <h2 className="dominion-font" style={{fontSize: "3em", color: victory ? "#005200": "#770000"}}>You scored {this.props.points} points</h2>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {Object.entries(this.props.breakdown).map(([playerName, breakdown]) => {
                            return (
                                <div style={{display: "flex", width: "100%", padding: "10px"}} key={playerName} className="dominion-font">
                                    <table style={{borderCollapse: "collapse", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: "6px", padding: "5px"}}>
                                        <thead>
                                            <tr style={{borderBottom: "0.1em solid black"}}>
                                                <th style={{borderRight: "0.1em solid black"}}>{playerName}</th>
                                                <th>Points: {breakdown.total}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(breakdown).map(([cardName, points]) => {
                                                if (cardName === "total") return null;
                                                return (
                                                    <tr key={cardName}>
                                                        <td style={{borderRight: "0.1em solid black"}}>{cardName}</td>
                                                        <td style={{color: points > 0 ? "black": "#770000"}}>{points}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                    <button className="btn btn-primary dominion-font" onClick={this.props.close} style={{width: "fit-content", marginTop: "auto", marginLeft: "auto"}}>Close</button>
                </div>
            </Modal>
        );
    }
}