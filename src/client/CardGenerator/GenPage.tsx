import * as React from 'react';
import CardGenerator from "./CardGenerator";

export default class GenPage extends React.Component {
    render() {
        return <CardGenerator
            cardArtUrl={"/img/cardback.png"}
            cardName={"copper"}
            cardTypes={["treasure"]}
            costs={{coin:0, potion: 0, debt: 0}}
            description={"+$1"}/>
    }
}