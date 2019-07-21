import * as React from 'react';
import * as ReactDOM from 'react-dom';
interface IProps {
    socket: SocketIOClient.Socket;
}
interface IState {
    logs: string[];
}
export default class LogView extends React.Component<IProps, IState> {
    shouldScroll = true;
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        };
        this.msg = this.msg.bind(this);
        this.props.socket.on('log', this.msg);
    }
    msg(msg) {
        this.setState((state) => {
            return {
                logs: state.logs.concat([msg])
            }
        });
    }
    componentWillUpdate() {
        let node = ReactDOM.findDOMNode(this)!.parentNode as HTMLDivElement;
        this.shouldScroll = Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 2;
    }
    componentDidUpdate() {
        if(this.shouldScroll) {
            let node = ReactDOM.findDOMNode(this)!.parentNode as HTMLDivElement;
            node.scrollTop = node.scrollHeight;
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                {this.state.logs.map((msg, i)=>{
                    return (
                        <div key={i}>
                            {msg}
                        </div>
                    )
                })}
            </div>
        )
    }
}