import * as React from 'react';
import getColorForButton from "./getColorForButton";
import {CardResource} from "./ClientCardRegisitry";
interface IProps {
    cardName: string;
    cardTypes: ReadonlyArray<string>;
    onClick: (cardName: string) => any;
}
export default function HandButton(props: {
    cardName: string;
    onClick: (cardName: string) => any;
}) {
    let cardDef;
    if (props.cardName !== "No Card") {
        cardDef = CardResource.read(props.cardName);
    }
    else {
        cardDef = {
            types: []
        }
    }
    return (
        <button
            className={"btn btn-"+getColorForButton(cardDef.types)}
            onClick={() => props.onClick(props.cardName)}
            style={{fontFamily:"TrajanPro-Bold",fontSize:'20px', padding: `4px 12px 4px 12px`, display: 'block', margin: '4px 0'}}>
            {props.cardName}
        </button>
    );
}