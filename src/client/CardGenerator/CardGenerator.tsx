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
    "shelter": [1, 0.1, 0.1],
    "ruins": [0.25, 0.05, 0],
    "landmark": [0.45, 1.25, 0.85],
    "night": [0.3, 0.4, 0.45],
    "boon": [1.4, 1.35, 0.55, 0, 0, 0, 1.7, 1.25, 0.65, 1.95, 1.6, 0.4],
    "hex": [0.75, 0.6, 2.1, 0, 0, 0, 0.8, 0.8, 0.8, 1.0, 0.75, 2.1],
    "state": [1.1, 1.3, 1.3, 0.6, 0.15, 0, 1.55, 1.15, 1.05, 1.4, 0.65, 0.45],
    "artifact": [2, 0.75, 0.2, 0.3, 0.15, 0.05],
    "project": [1.9, 0.6, 0.8, 0.4, 0.2, 0.15]
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
    factorOverrides?: [number, number, number];
}
function pickTypesFromTypeArray(types: readonly string[]): [string, string | undefined] {
    if (types.length === 1 && Object.keys(colorFactorLists).includes(types[0])) {
        return [types[0], undefined];
    }
    if (types.includes('action') && types.includes('victory')) {
        return ['victory', 'action'];
    }
    if (types.includes('reaction') && types.includes('shelter')) {
        return ['reaction', 'shelter'];
    }
    if (types.includes('shelter') && types.includes('action')) {
        return ['action', 'shelter'];
    }
    if (types.includes('shelter') && types.includes('victory')) {
        return ['victory', 'shelter'];
    }
    if (types.includes('reaction')) {
        return ['reaction', undefined];
    }
    if (types.includes('ruins')) {
        return ['ruins', undefined];
    }
    return ['action', undefined];
}
export default class CardGenerator extends React.Component<IProps, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.props.cardTypes.includes("project") || this.props.cardTypes.includes("artifact")) {
            return this.renderLandscape();
        }
        else {
            return this.renderPortrait();
        }
    }

    renderLandscape() {
        return (
            <svg viewBox={'0 0 1887 730'} style={{height: "100%"}}>
                <image href={this.props.cardArtUrl} x={455} y={112} width={980} height={382} preserveAspectRatio="xMidYMin slice"/>
                <RecolorFilter factors={colorFactorLists[this.props.cardTypes[0]]} name={'color0'} />
                <image href="/img/card-resources/EventColorOne.png" x={0} y={0} width={1887} height={730} filter="url(#color0)" />
                <image href="/img/card-resources/EventBrown.png" x={0} y={0} width={1887} height={730} />
                <image href="/img/card-resources/EventBrown2.png" x={0} y={0} width={1887} height={730} />
                <foreignObject x={720} y={55} width={450} height={50} fontSize={42}>
                    <div style={{height: "100%", width: "100%", textAlign: "center", lineHeight: "1em"}}>
                        <span style={{fontFamily: "TrajanPro-Bold"}}>{this.props.cardName}</span>
                    </div>
                </foreignObject>
                <foreignObject x={975} y={-902} width={175} height={50} fontSize={35} transform="rotate(45)">
                    <div style={{height: "100%", width: "100%", textAlign: "center", lineHeight: "1em"}}>
                        <span style={{fontFamily: "TrajanPro-Bold"}}>{this.props.cardTypes[0]}</span>
                    </div>
                </foreignObject>
                <foreignObject x={460} y={500} width={965} height={155}>
                    <div style={{height: "100%", width: "100%", textAlign: "center", padding: "15px"}}>
                        <DescriptionText description={this.props.description} smallDescription={this.props.smallDescription} defaultSize={24}/>
                    </div>
                </foreignObject>
            </svg>
        );
    }
    renderPortrait(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const [type, secondaryType] = pickTypesFromTypeArray(this.props.cardTypes);
        return (
            <svg viewBox={`0 0 1403 2151`} style={{height: "100%"}}>
                <RecolorFilter factors={this.props.factorOverrides || colorFactorLists[type]} name={'color0'} />
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
                <ForceWrappingTextLine line={this.props.cardTypes.map((a, i) => i === 0 ? a : i % 2 === 1 ? "\u00a0-\u00a0" + a : " - " + a).join("")} x={300} y={1865} maxWidth={890} maxHeight={120} initialSize={64} />
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
class ForceWrappingTextLine extends React.Component<{line: string; x: number; y: number; maxWidth: number; maxHeight: number; initialSize?: number; family?: string; style?: string}, {size: number}> {
    foreignObjectRef = React.createRef<SVGForeignObjectElement>();
    desRef = React.createRef<HTMLDivElement>();
    constructor(props) {
        super(props);
        this.state = {
            size: props.initialSize || 85
        };
    }
    componentDidMount() {
        const foreignHeight = this.foreignObjectRef.current && this.foreignObjectRef.current.getBoundingClientRect().height;
        const desHeight = this.desRef.current && this.desRef.current.getBoundingClientRect().height;
        if (foreignHeight !== desHeight) {
            window.setTimeout(() => {
                this.setState({
                    size: this.state.size - 1
                });
            }, 0);
        }
    }
    componentDidUpdate(): void {
        const foreignHeight = this.foreignObjectRef.current && this.foreignObjectRef.current.getBoundingClientRect().height;
        const desHeight = this.desRef.current && this.desRef.current.getBoundingClientRect().height;
        if (foreignHeight !== desHeight) {
            window.setTimeout(() => {
                this.setState({
                    size: this.state.size - 1
                });
            }, 10);
        }
        else {
            console.log('typeline: ' + this.state.size);
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const baseStyle = {
            fontSize: this.state.size + "pt",
            fontFamily: this.props.family || "TrajanPro-Bold",
            fontWeight: "normal" as "normal" | "bold",
            fontStyle: "normal" as "normal" | "italic",
            whiteSpace: "inherit" as "inherit" | "nowrap",
            verticalAlign: "-webkit-baseline-middle"
        } as const;
        return (
            <foreignObject x={this.props.x} y={this.props.y} width={this.props.maxWidth} height={this.props.maxHeight} ref={this.foreignObjectRef}>
                <div style={{display: "table", position: "absolute", top: 0, left: 0, height: "100%", width: "100%"}}>
                    <div style={{width: "100%", height:"fit-content", textAlign: "center", lineHeight: this.state.size + Math.floor(this.state.size / 15) + "pt", display: "table-cell", verticalAlign: "middle"}} ref={this.desRef}>
                        <span style={baseStyle}>{this.props.line}</span>
                    </div>
                </div>
            </foreignObject>
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
class DescriptionText extends React.Component<{description: string; smallDescription: boolean; defaultSize: number}, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const textStyle = {
            fontSize: this.props.smallDescription ? ((this.props.defaultSize * (3/4)) + "pt") : `${this.props.defaultSize}pt`,
            fontFamily: "Times New Roman"
        } as const;
        return this.props.description.split("\n").map((text) => {
            let extraStyle = {};
            if (/\+\d (Action|Card|Buy|Coffer|Villager)s?/.test(text)) {
                extraStyle = {
                    fontWeight: "bold",
                    fontSize: this.props.smallDescription ? `${(this.props.defaultSize + 4) * (3/4)}pt` : `${this.props.defaultSize + 4}pt`
                };
            }
            if (/^\+\$\d/.test(text)) {
                const num = text.slice(2,3);
                extraStyle = {
                    fontWeight: "bold",
                    fontSize: this.props.smallDescription ? `${(this.props.defaultSize + 4) * (3/4)}pt` : `${this.props.defaultSize + 4}pt`
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
        });
    }
}
class Description extends React.Component<{description: string;heirloomPresent: boolean; smallDescription: boolean}, {fontSize: number}> {
    constructor(props) {
        super(props);
        this.state = {
            fontSize: 60
        };
    }

    foreignObjectRef = React.createRef<SVGForeignObjectElement>();
    desRef = React.createRef<HTMLDivElement>();
    componentDidMount() {
        const foreignHeight = this.foreignObjectRef.current && this.foreignObjectRef.current.getBoundingClientRect().height;
        const desHeight = this.desRef.current && this.desRef.current.getBoundingClientRect().height;
        if (foreignHeight !== desHeight) {
            window.setTimeout(() => {
                this.setState({
                    fontSize: this.state.fontSize - 1
                });
            }, 0);
        }
    }
    componentDidUpdate(prevProps): void {
        if (prevProps !== this.props) {
            this.setState({
                fontSize: 60
            });
            return;
        }
        const foreignHeight = this.foreignObjectRef.current && this.foreignObjectRef.current.getBoundingClientRect().height;
        const desHeight = this.desRef.current && this.desRef.current.getBoundingClientRect().height;
        if (foreignHeight !== desHeight) {
            window.setTimeout(() => {
                this.setState({
                    fontSize: this.state.fontSize - 1
                });
            }, 10);
        }
        else {
            console.log("description: " + this.state.fontSize);
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <foreignObject x={140} y={1140} width={1130} height={this.props.heirloomPresent ? 620 : 700} ref={this.foreignObjectRef}>
                <div style={{display: "table", position: "absolute", top: 0, left: 0, height: "100%", width: "100%"}}>
                    <div style={{width: "100%", height:"fit-content", textAlign: "center", lineHeight: this.state.fontSize + Math.floor(this.state.fontSize / 15) + "pt", display: "table-cell", verticalAlign: "middle", padding: `0 ${Math.floor(this.state.fontSize * (5/4))}pt`}} ref={this.desRef}>
                        {this.props.description.split("\n").map((text, i) => {
                            return <DescriptionLine key={i} line={text} fontSize={this.state.fontSize} />;
                        })}
                    </div>
                </div>
            </foreignObject>
        );
    }
}
class DescriptionLine extends React.Component<{line: string; fontSize: number}, {}> {
    render() {
        const baseStyle = {
            fontSize: this.props.fontSize + "pt",
            fontFamily: "Times New Roman",
            fontWeight: "normal" as "normal" | "bold",
            fontStyle: "normal" as "normal" | "italic",
            whiteSpace: "inherit" as "inherit" | "nowrap"
        } as const;
        const phrases = this.props.line.split(/(\+\d+\s*(?:[a-z]|[A-Z])*)|([+-]?\$\d+)|([+-]?\d+VP)|(---)|(\(This is not in the Supply.\))/g).filter((a) => a);
        return phrases.map((a, i) => {
            let thisStyle = {
                ...baseStyle
            };
            if (/^[+-]/.test(a)) {
                console.log(`making "${a}" bold`);
                thisStyle.fontSize = this.props.fontSize + Math.floor(this.props.fontSize / 15) + "pt";
                thisStyle.fontWeight = "bold";
            }
            if (/\$/.test(a)) {
                const [, pre, amount, post] = /^(.*?)\$(\d*)(.*?)/g.exec(a)!;
                thisStyle.whiteSpace = "nowrap";
                return (
                    <span key={i} style={thisStyle}>
                        {pre.trimRight()}
                        <CoinIcon amount={amount} multiplier={phrases.length === 1 ? 1.5 : 1.2} />
                        {post.trimLeft()}
                    </span>
                );
            }
            if (/VP/.test(a)) {
                const [, pre, post] = /^(.*?)VP(.*?)/g.exec(a)!;
                thisStyle.whiteSpace = "nowrap";
                return (
                    <span key={i} style={thisStyle}>
                        {pre.trimRight()}
                        <VPIcon multiplier={phrases.length === 1 ? 1.5 : 1.2}/>
                        {post.trimLeft()}
                    </span>
                );
            }
            if (/---/.test(a)) {
                return <hr key={i} style={{borderColor: "black", borderWidth: "3px", margin: this.props.fontSize * 0.5 + "pt"}} />;
            }
            if (/\(This is not in the Supply.\)/.test(a)) {
                thisStyle.fontStyle = "italic";
            }
            return <span key={i} style={thisStyle}>{a}</span>;
        }).concat([phrases.length === 1 && phrases[0] === "---" ? <span key={phrases.length} /> : <br key={phrases.length} />]);
    }
}
class CoinIcon extends React.Component<{amount: string; multiplier: number}> {
    render() {
        return (
            <svg height={this.props.multiplier + "em"} width={this.props.multiplier + "em"} viewBox="0 0 100 100" style={{verticalAlign: 'middle'}}>
                <desc>{this.props.amount} coins</desc>
                <image xlinkHref="/img/CoinHighRes.png" x="0" y="0" height="100" width="100"/>
                <text x={("" + this.props.amount).length > 1 ? "14":"28.5"} y="75" fontSize="70" letterSpacing="-12" style={{fontWeight: "normal", fontFamily: "TrajanPro-Bold"}}>{this.props.amount}</text>
            </svg>
        );
    }
}
function VPIcon(props: {multiplier: number}) {
    return (
        <svg height={props.multiplier + "em"} width={props.multiplier + "em"} viewBox="0 0 100 100" style={{verticalAlign: 'middle'}}>
            <desc>Victory Point</desc>
            <image xlinkHref="/img/VP.png" x="0" y="0" height="100" width="100"/>
        </svg>
    );
}