import * as React from 'react';
import getColorForButton from "./getColorForButton";
interface IProps {
    cardName: string;
    cardTypes: readonly string[];
    onClick: (cardName: string) => any;
    onHover: () => any;
    cardText: string;
    cost: {
        coin: number;
    };
    supplyAmount?: number;
    hideCost?: boolean;
    disabled: boolean;
    embargoAmount?: number;
    markers: string[];
    flash?: boolean;
}
export default class SupplyButton extends React.Component<IProps, {}> {
    static genCoinIcon(num) {
        return (
            <svg height="1.2em" width="1.2em" viewBox="0 0 100 100" style={{verticalAlign: 'middle'}}>
                <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100"/>
                <text x={("" + num).length > 1 ? "14":"28.5"} y="75" fontSize="70" letterSpacing="-12">{num}</text>
            </svg>
        );
    }
    static genEmbargoIcon() {
        return (
            <svg height="1.2em" width="1.2em" viewBox="0 0 100 100">
                <filter id="colorHueRotate">
                    <feColorMatrix in="SourceGraphic"
                        type="hueRotate"
                        values="-121" />
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="0.3" />
                        <feFuncG type="linear" slope="0.2" />
                        <feFuncB type="linear" slope="0.25" />
                        <feFuncA type="identity" />
                    </feComponentTransfer>
                </filter>
                <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100" filter="url(#colorHueRotate)"/>
                <image xlinkHref="/img/VP.png" x="20" y="20" height="60" width="60"/>
            </svg>
        );
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const embargoImg: any[] = [];
        for (let i = 0; i < (this.props.embargoAmount || 0); i++) {
            embargoImg.push(SupplyButton.genEmbargoIcon());
        }
        const padding = 4 + (this.props.markers.length * 10);
        let animation;
        if (this.props.flash) {
            animation = {
                animationName: "button-flash",
                animationDuration: "1s",
                animationDirection: "alternate",
                animationIterationCount: "infinite",
                animationDelay: "-0.3s"
            };
        }
        else {
            animation = {};
        }
        const isDisabled = this.props.disabled && !(this.props.cardTypes.includes("artifact") || this.props.cardTypes.includes("way"));
        return (
            <button
                className={"btn btn-"+getColorForButton(this.props.cardTypes)+(isDisabled ? " btn-disabled" : "")}
                onClick={() => !isDisabled && this.props.onClick(this.props.cardName)}
                onMouseEnter={this.props.onHover}
                style={{fontFamily:"TrajanPro-Bold",fontSize:'24px', padding: `4px 12px ${padding}px 6px`, ...animation}}>
                {!this.props.hideCost && <div style={{display:"inline",marginRight:"6px"}}>{SupplyButton.genCoinIcon(this.props.cost.coin)}</div>}
                {this.props.cardName} {this.props.supplyAmount != null ? `(${this.props.supplyAmount})` : ''} {embargoImg}
                {this.props.markers.map((marker, i) => <span key={i} style={{fontFamily: "TrajanPro-Bold", fontSize: "10px", position: "absolute", bottom: 0, left: "50%", transform: "translate(-50%, 0)"}}>{marker}</span>)}
            </button>
        );
    }
}