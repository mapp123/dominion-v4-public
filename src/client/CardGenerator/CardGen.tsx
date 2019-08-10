import * as React from 'react';
import CardGenerator from "./CardGenerator";

export default class CardGen extends React.Component {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <CardGenerator cardArtUrl={"/img/card-img/CathedralArt.jpg"} cardName={"Cathedral"} cardTypes={["project"]} costs={{coin: 3}} smallDescription={false} description={"At the start of your turn, trash a card from your hand."} />
        );
    }
}