import * as React from 'react';
const colorFactorLists = {
    "action": [1, 1, 1],
    "event": [1, 1, 1],
    "treasure": [0.9, 0.65, 0.1],
    "victory": [0.35, 0.7, 0.15],
    "reaction": [0.2, 0.4, 1.05],
    "duration": [1.1, 0.3, 0],
    "reserve": [0.9, 0.75, 0.5],
    "curse": [0.6, 0.15, 0.6],
    "shelter": [1.05, 0.65, 0.5],
    "ruins": [0.75, 0.6, 0.35],
    "landmark": [0.45, 1.25, 0.85],
    "night": [0.3, 0.4, 0.45],
    "boon": [1.4, 1.35, 0.55, 0, 0, 0, 1.7, 1.25, 0.65, 1.95, 1.6, 0.4],
    "hex": [0.75, 0.6, 2.1, 0, 0, 0, 0.8, 0.8, 0.8, 1.0, 0.75, 2.1],
    "state": [1.1, 1.3, 1.3, 0.6, 0.15, 0, 1.55, 1.15, 1.05, 1.4, 0.65, 0.45],
    "artifact": [1.15, 1, 0.75, 0.3, 0.15, 0.05],
    "project": [1.15, 0.95, 0.9, 0.4, 0.2, 0.15]
};
const genericCustomAccentColors = [
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1.2, 0.8, 0.5],
    [0, 0, 0, 0, 0, 0, 0.9, 0.8, 0.7, 0.9, 0.8, 0.7]
];
interface IProps {
    cardArtUrl: string;
    heirloomLine?: string;
    cardName: string;
    cardTypes: readonly string[];
    costs: {
        coin: number;
        debt?: number;
        potion?: number;
    };
    smallDescription: boolean;
    description: string;
}
function pickTypesFromTypeArray(types: readonly string[]): [string, string | undefined] {
    if (types.length === 1 && Object.keys(colorFactorLists).includes(types[0])) {
        return [types[0], undefined];
    }
    if (types.includes('action') && types.includes('victory')) {
        return ['victory', 'action'];
    }
    if (types.includes('reaction')) {
        return ['reaction', undefined];
    }
    return ['action', undefined];
}
export default class CardGenerator extends React.Component<IProps, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const [type, secondaryType] = pickTypesFromTypeArray(this.props.cardTypes);
        return (
            <svg viewBox={`0 0 1403 2151`} style={{height: "100%"}}>
                <RecolorFilter factors={colorFactorLists[type]} name={'color0'} />
                {secondaryType && <RecolorFilter factors={colorFactorLists[secondaryType]} name={'color1'}/>}
                <RecolorFilter factors={colorFactorLists[type]} name={'cardGray'} offset={6} />
                <RecolorFilter factors={colorFactorLists[type]} name={'cardBrown'} offset={9} />
                <image href={this.props.cardArtUrl} width={1150} height={835} x={129} y={288.5} preserveAspectRatio="xMidYMin slice"/>
                <image href="/img/card-resources/CardColorOne.png" x={0} y={0} filter="url(#color0)"/>
                {secondaryType && <image href="/img/card-resources/CardColorTwo.png" x={0} y={0} filter="url(#color1)"/>}
                <image href="/img/card-resources/CardGray.png" x={0} y={0} filter="url(#cardGray)"/>
                <image href="/img/card-resources/CardBrown.png" x={0} y={0} filter="url(#cardBrown)"/>
                <image href="/img/card-resources/DescriptionFocus.png" x={44} y={1094} />
                {this.props.heirloomLine && <image href="/img/card-resources/Heirloom.png" x={97} y={1720} />}
                {this.props.heirloomLine && <SingleTextLine line={this.props.heirloomLine} x={701} y={1835} maxWidth={1040} initialSize={58} family="Times New Roman" style={"italic"}/>}
                <SingleTextLine line={this.props.cardName} x={701} y={242} maxWidth={1180} initialSize={75} />
                <SingleTextLine line={this.props.cardTypes.join(" - ")} x={750} y={1950} maxWidth={890} initialSize={64} />
                <image href="/img/CoinHighRes.png" x={129} y={1850} width={150} height={145} />
                <text x={205} y={1965} textAnchor="middle" style={{fontSize: "86pt", fontFamily: "TrajanPro-Bold"}}>{this.props.costs.coin}</text>
                <Description description={this.props.description} heirloomPresent={!!this.props.heirloomLine} smallDescription={this.props.smallDescription}/>
            </svg>
        );
    }
}
class RecolorFilter extends React.Component<{factors: number[]; name: string; offset?: number}, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        let factors = [...this.props.factors];
        let offset = this.props.offset || 0;
        if (this.props.offset === 0) {
            if (factors.length === 3) {
                factors.push(0, 0, 0);
            }
        }
        else {
            while (factors.length < 12) {
                // push generic custom accent colors
                factors.push(genericCustomAccentColors[0][factors.length]);
            }
            factors = [...factors.slice(offset, offset + 3), 0, 0, 0];
        }
        return (
            <filter id={this.props.name}>
                <feColorMatrix in="SourceGraphic"
                    type="matrix"
                    values={`${factors[0]} 0 0 0 ${factors[3]}\n0 ${factors[1]} 0 0 ${factors[4]}\n0 0 ${factors[2]} 0 ${factors[5]}\n0 0 0 1 0`} />
            </filter>
        );
    }
}
class SingleTextLine extends React.Component<{line: string; x: number; y: number; maxWidth: number; initialSize?: number; family?: string; style?: string}, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const family = this.props.family || "TrajanPro-Bold";
        const size = (this.props.initialSize || 85) + 2;
        return <text x={this.props.x}
            y={this.props.y}
            style={{fontFamily: family, fontSize: size + "pt", fontStyle: this.props.style || "unset"}}
            textAnchor="middle">{this.props.line}</text>;
    }
}
class Description extends React.Component<{description: string;heirloomPresent: boolean; smallDescription: boolean;}, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const textStyle = {
            fontSize: this.props.smallDescription ? "45pt" : "60pt",
            fontFamily: "Times New Roman"
        } as const;
        return (
            <foreignObject x={140} y={1140} width={1130} height={this.props.heirloomPresent ? 620 : 700}>
                <div style={{display: "table", position: "absolute", top: 0, left: 0, height: "100%", width: "100%"}}>
                    <div style={{width: "100%", height:"fit-content", textAlign: "center", lineHeight: this.props.smallDescription ? "48pt" : "64pt", display: "table-cell", verticalAlign: "middle", padding: "0 75pt"}}>
                        {this.props.description.split("\n").map((text) => {
                            let extraStyle = {};
                            if (/\+\d (Action|Card|Buy)s?/.test(text)) {
                                extraStyle = {
                                    fontWeight: "bold",
                                    fontSize: this.props.smallDescription ? "48pt" : "64pt"
                                };
                            }
                            if (/^\+\$\d/.test(text)) {
                                const num = text.slice(2,3);
                                extraStyle = {
                                    fontWeight: "bold",
                                    fontSize: this.props.smallDescription ? "48pt" : "64pt"
                                };
                                return (
                                <>
                                    <span style={{...textStyle, ...extraStyle}}>
                                        +
                                        <svg height="1.5em" width="1.5em" viewBox="0 0 100 100" style={{verticalAlign: 'middle'}}>
                                            <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100"/>
                                            <text x={("" + num).length > 1 ? "14":"28.5"} y="75" fontSize="70" letterSpacing="-12" style={{fontWeight: "normal", fontFamily: "TrajanPro-Bold"}}>{num}</text>
                                        </svg>
                                    </span>
                                    <br />
                                </>
                                );
                            }
                            return (
                            <>
                                <span style={{...textStyle, ...extraStyle}}>{text.split("$").map((item, i) => {
                                    if (i % 2 === 0) {
                                        return item;
                                    }
                                    const [, num, rest] = (/^(\d*)(.*)/.exec(item) || [null, "", ""]);
                                    return (
                                        <>
                                            <svg height="1.2em" width="1.2em" viewBox="0 0 100 100" style={{verticalAlign: 'middle'}}>
                                                <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100"/>
                                                <text x={("" + num).length > 1 ? "14":"28.5"} y="75" fontSize="70" letterSpacing="-12" style={{fontWeight: "normal", fontFamily: "TrajanPro-Bold"}}>{num}</text>
                                            </svg>
                                            <span>{rest}</span>
                                        </>
                                    );
                                })}</span>
                                <br />
                            </>
                            );
                        })}
                    </div>
                </div>
            </foreignObject>
        );
    }
}