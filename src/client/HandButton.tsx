import * as React from 'react';
import getColorForButton from "./getColorForButton";
import {ValidCardTypes} from "../cards/Card";
interface IProps {
    cardName: string;
    types: readonly ValidCardTypes[];
    onClick: (cardName: string) => any;
}
export default function HandButton(props: IProps) {
    console.log(props.types);
    return (
        <button
            className={"btn btn-"+getColorForButton(props.types)}
            onClick={() => props.onClick && props.onClick(props.cardName)}
            style={{fontFamily:"TrajanPro-Bold",fontSize:'20px', padding: `4px 12px 4px 12px`, display: 'block', margin: '4px 0'}}>
            {props.cardName}
        </button>
    );
}