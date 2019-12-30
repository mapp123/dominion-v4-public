import * as React from 'react';
import Card, {CardImplementation} from "../cards/Card";
import ClientCardRegistry from "./ClientCardRegistry";
import HandButton from "./HandButton";

interface IProps {
    trash: Card[];
    setHoveredCard: (card: CardImplementation | null) => any;
}
export default class TrashView extends React.Component<IProps, {}> {
    onHover(card: Card) {
        ClientCardRegistry.getInstance().getCard(card.name).then((a) => {
            this.props.setHoveredCard(a);
        });
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const trash = this.props.trash.filter((a, i) => this.props.trash.findIndex((b) => b.name === a.name) === i)
            .map((card) => ({
                ...card,
                name: this.props.trash.filter((a) => a.name === card.name).length + " " + card.name,
                types: card.types,
                trueCard: card
            }));
        return (
            <React.Suspense fallback={<span>Loading...</span>}>
                {trash.map((card) => <HandButton cardName={card.name} id={card.id} types={card.types} key={card.id}
                    onClick={() => {}} onHover={this.onHover.bind(this, card.trueCard)} narrow={true}/>)}
            </React.Suspense>
        );
    }
}