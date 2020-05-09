import * as React from 'react';
import getColorForButton from "./getColorForButton";
import type {ValidCardTypes} from "../cards/Card";
interface IProps {
    cardName: string;
    id: string;
    types: readonly ValidCardTypes[];
    onClick: (wayName?: string) => any;
    onHover: (cardName: string) => any;
    narrow?: boolean;
    disabled?: boolean;
    withWays?: string[];
}
export default function HandButton(props: IProps) {
    const isDisabled = !!props.disabled;
    const cardButton = (
        <button
            className={"btn btn-"+getColorForButton(props.types)+(props.narrow ? " btn-sm" : "")+(isDisabled ? " btn-disabled" : "")}
            id={props.id}
            onClick={() => !isDisabled ? props.onClick() : null}
            onMouseEnter={() => props.onHover(props.cardName)}
            style={{fontFamily:"TrajanPro-Bold",fontSize: props.narrow ? '16px' : '20px', padding: `4px ${props.narrow ? 4 : 12}px 4px ${props.narrow ? 4 : 12}px`, display: props.narrow ? 'inline-block' : 'block', margin: '4px 0'}}>
            {props.cardName}
        </button>
    );
    if (!props.withWays || !props.types.includes("action")) {
        return cardButton;
    }
    else {
        return (
            <div className="btn-group" style={{margin: "-4px 0"}}>
                {cardButton}
                {props.withWays.map((wayName) => (
                    <button
                        className={"btn btn-warning way-button-override"+(props.narrow ? " btn-sm" : "")+(isDisabled ? " btn-disabled" : "")}
                        key={wayName}
                        onClick={() => !isDisabled ? props.onClick(wayName) : null}
                        onMouseEnter={() => props.onHover(wayName)}
                        style={{fontFamily:"TrajanPro-Bold",fontSize: props.narrow ? '16px' : '20px', padding: `4px ${props.narrow ? 4 : 12}px 4px ${props.narrow ? 4 : 12}px`, display: props.narrow ? 'inline-block' : 'block', margin: '4px 0'}}>
                        {wayName}
                    </button>
                ))}
            </div>
        );
    }
}