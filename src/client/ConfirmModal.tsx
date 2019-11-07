import * as React from 'react';
import * as ReactModal from "react-modal";
interface IProps {
    onChosen: (confirm: boolean) => any;
    isOpen: boolean;
}
export default class ConfirmModal extends React.Component<IProps> {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(): void {
        // @ts-ignore
        if (this.props.isOpen && window.dominionNoPrompts) {
            this.props.onChosen(true);
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <ReactModal isOpen={this.props.isOpen} overlayClassName="modal-overlay" className="modal-confirm">
                <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                    <div style={{textAlign: "center", padding: "10px", display: "flex", flexDirection: "column", margin: "auto 0", background: "#ffffff", borderRadius: "4px"}}>
                        <h1 className="dominion-font" style={{fontSize: "2em"}}>Are you sure?</h1>
                        <div className="btn-group" style={{marginLeft: "auto", width: "fit-content"}}>
                            <button className="btn btn-success dominion-font" onClick={this.props.onChosen.bind(this, true)}>Yes</button>
                            <button className="btn btn-danger dominion-font" onClick={this.props.onChosen.bind(this, false)}>No</button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        );
    }
}