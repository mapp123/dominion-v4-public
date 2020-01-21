import * as React from 'react';
import getColorForButton from "./getColorForButton";
import {ValidCardTypes} from "../cards/Card";
interface IProps {
    cardName: string;
    id: string;
    types: readonly ValidCardTypes[];
    onClick: (cardName: string) => any;
    onHover: (cardName: string) => any;
    narrow?: boolean;
    disabled?: boolean;
}
export default function HandButton(props: IProps) {
    const isDisabled = !!props.disabled;
    return (
        <button
            className={"btn btn-"+getColorForButton(props.types)+(props.narrow ? " btn-sm" : "")+(isDisabled ? " btn-disabled" : "")}
            id={props.id}
            onClick={() => !isDisabled ? props.onClick(props.cardName) : null}
            onMouseEnter={() => props.onHover(props.cardName)}
            style={{fontFamily:"TrajanPro-Bold",fontSize: props.narrow ? '16px' : '20px', padding: `4px ${props.narrow ? 4 : 12}px 4px ${props.narrow ? 4 : 12}px`, display: props.narrow ? 'inline-block' : 'block', margin: '4px 0'}}>
            {props.cardName}
        </button>
    );
}