import * as React from 'react';
import * as ReactModal from "react-modal";
interface IProps {
    onChosen: (username: string) => any;
    isOpen: boolean;
}
export default class ChooseUsernameModal extends React.Component<IProps, {username: string}> {
    constructor(props) {
        super(props);
        this.state = {
            username: ""
        };
    }

    setUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    keyUp(e) {
        if (e.keyCode === 13) {
            this.props.onChosen(this.state.username);
        }
    }

    submit() {
        this.props.onChosen(this.state.username);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <ReactModal isOpen={this.props.isOpen} overlayClassName="modal-overlay" className="modal-username">
                <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                    <div style={{textAlign: "center", padding: "10px", display: "flex", flexDirection: "column", margin: "auto 0", background: "#ffffff", borderRadius: "4px"}}>
                        <h1 className="dominion-font" style={{fontSize: "2em"}}>What would you like your username to be?</h1>
                        <div className="form-group">
                            <input className="form-control" value={this.state.username} onChange={this.setUsername.bind(this)} onKeyUp={this.keyUp.bind(this)} autoFocus={true}/>
                        </div>
                        <button className="btn btn-primary dominion-font" style={{marginLeft: "auto", width: "fit-content"}} onClick={this.submit.bind(this)}>Submit</button>
                    </div>
                </div>
            </ReactModal>
        );
    }
}