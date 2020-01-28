import * as React from 'react';
import Card, {CardImplementation} from "../cards/Card";
import ClientCardRegistry from "./ClientCardRegistry";
import HandButton from "./HandButton";

interface IProps {
    tavern: Array<{canCall: boolean; card: Card}>;
    setHoveredCard: (card: CardImplementation | null) => any;
    onClick: (cardId: string) => any;
}
export default class TavernMat extends React.Component<IProps, {}> {
    onHover(card: Card) {
        ClientCardRegistry.getInstance().getCard(card.name).then((a) => {
            this.props.setHoveredCard(a);
        });
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <React.Suspense fallback={<span>Loading...</span>}>
                {this.props.tavern.map(({card, canCall}) => <HandButton cardName={card.name} id={card.id} types={card.types} key={card.id} disabled={!canCall}
                    onClick={this.props.onClick.bind(null, card.id)} onHover={this.onHover.bind(this, card)} narrow={true}/>)}
            </React.Suspense>
        );
    }
}