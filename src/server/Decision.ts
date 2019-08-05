import Card from "../cards/Card";
import {Struct, struct} from "superstruct";
import Game from "./Game";
import {GainRestrictions, GainRestrictionsJSON} from "./GainRestrictions";

export type Decision = ChooseUsernameDecision | ChooseCardOrBuyDecision | BuyDecision | ChooseCardDecision | ConfirmDecision | GainDecision | OptionDecision | ReorderDecision;

// noinspection JSUnusedLocalSymbols
type AllDecisionHaveHelperText = Decision['helperText'];

interface ChooseUsernameDecision {
    decision: 'chooseUsername';
    id: string;
    helperText: string;
}

interface ChooseCardOrBuyDecision {
    decision: 'chooseCardOrBuy';
    id: string;
    source: Card[];
    gainRestrictions: GainRestrictionsJSON;
    helperText: string;
}

interface BuyDecision {
    decision: 'buy';
    id: string;
    gainRestrictions: GainRestrictionsJSON;
    helperText: string;
}

interface ChooseCardDecision {
    decision: 'chooseCard';
    id: string;
    source: Card[];
    helperText: string;
}

interface ConfirmDecision {
    decision: 'confirm';
    id: string;
    helperText: string;
}

interface GainDecision {
    decision: 'gain';
    id: string;
    gainRestrictions: GainRestrictionsJSON;
    optional: boolean;
    helperText: string;
}

interface OptionDecision {
    decision: 'chooseOption';
    id: string;
    options: string[];
    helperText: string;
}

interface ReorderDecision {
    decision: 'reorder';
    topString: string;
    bottomString: string;
    cards: Card[];
    helperText: string;
    id: string;
}

const wrapStruct = <T>(struct: Struct<T>) => (game, decision, response) => struct(response);

const ChooseCardOrBuyResponse = struct({
    responseType: struct.enum(['buy', 'playCard'] as const),
    choice: struct.partial({
        id: "string",
        name: "string"
    })
});

const BuyResponse = struct.partial({
    choice: struct.partial({
        id: "string",
        name: "string"
    })
});

const ChooseCardResponse = struct.partial({
    id: "string",
    name: "string"
});

const chooseCardOrBuyValidator = (game: Game, decision: Decision, response: any) => {
    const r = ChooseCardOrBuyResponse(response);
    if (decision.decision !== 'chooseCardOrBuy') {
        throw new Error("Wrong validator.");
    }
    switch (r.responseType) {
        case 'buy':
            if (r.choice.name === 'End Turn') {
                break;
            }
            if (!GainRestrictions.fromJSON(decision.gainRestrictions).validateCard(r.choice.name)) {
                throw new Error("Choice is invalid.");
            }
            break;
        case 'playCard':
            if (decision.source.find((a) => a.name === r.choice.name) == null) {
                throw new Error("Choice is invalid.");
            }
            break;
    }
    return r;
};

const buyValidator = (game: Game, decision: Decision, response: any) => {
    const r = BuyResponse(response);
    if (decision.decision !== 'buy') {
        throw new Error("Wrong validator.");
    }
    if (r.choice.name === 'End Turn') {
        return r;
    }
    if (!GainRestrictions.fromJSON(decision.gainRestrictions).validateCard(r.choice.name)) {
        throw new Error("Choice is invalid.");
    }
    return r;
};

const chooseCardValidator = (game: Game, decision: Decision, response: any) => {
    const r = ChooseCardResponse(response);
    if (decision.decision !== 'chooseCard') {
        throw new Error("Wrong validator.");
    }
    if (decision.source.find((a) => a.id === r.id && a.name === r.name) == null) {
        console.log("Invalid choice");
        throw new Error("Choice is invalid.");
    }
    return r;
};

const ConfirmResponse = struct.scalar('boolean');

const GainResponse = struct.partial({
    id: "string",
    name: "string"
});

const gainValidator = (game: Game, decision: Decision, response: any) => {
    const r = GainResponse(response);
    if (decision.decision !== 'gain') {
        throw new Error("Wrong validator");
    }
    if (r.name === 'Gain Nothing' && (decision.gainRestrictions.allowedCards.length === 0 || decision.optional)) {
        return r;
    }
    if (!GainRestrictions.fromJSON(decision.gainRestrictions).validateCard(r.name)) {
        throw new Error("Choice is invalid");
    }
    return r;
};

const OptionResponse = struct({
    choice: "string"
});

const optionValidator = (game: Game, decision: Decision, response: any) => {
    const r = OptionResponse(response);
    if (decision.decision !== 'chooseOption') {
        throw new Error("Wrong validator");
    }
    if (!decision.options.includes(r.choice)) {
        throw new Error("Invalid choice");
    }
    return r;
};

const ReorderResponse = struct({
    order: [struct.partial({
        id: "string",
        name: "string"
    })]
});

const reorderValidator = (game: Game, decision: Decision, response: any) => {
    const r = ReorderResponse(response);
    if (decision.decision !== 'reorder') {
        throw new Error("Wrong validator");
    }
    const extraInR = r.order.filter((a) => decision.cards.find((b) => a.id === b.id) == null).length !== 0;
    const extraInD = decision.cards.filter((a) => r.order.find((b) => b.id === a.id) == null).length !== 0;
    const lengthMatch = decision.cards.length !== r.order.length;
    if (extraInD || extraInR || lengthMatch) {
        throw new Error("Invalid order");
    }
    return r;
};

export const DecisionValidators = {
    chooseUsername: wrapStruct(struct.scalar('string')),
    chooseCardOrBuy: chooseCardOrBuyValidator,
    buy: buyValidator,
    chooseCard: chooseCardValidator,
    confirm: wrapStruct(ConfirmResponse),
    gain: gainValidator,
    chooseOption: optionValidator,
    reorder: reorderValidator
};

export type DecisionResponseType = {
    [K in keyof typeof DecisionValidators]: ReturnType<typeof DecisionValidators[K]>
}

const chooseCardOrBuyDefault = (decision: Decision) => {
    if (decision.decision !== 'chooseCardOrBuy') {
        throw new Error("Wrong defaulter");
    }
    if (decision.gainRestrictions.allowedCards.length === 0 && decision.source.length === 0) {
        return {
            responseType: 'buy',
            choice: {
                name: 'End Turn',
                id: ''
            }
        };
    }
    return null;
};

const buyDefault = (decision: Decision) => {
    if (decision.decision !== 'buy') {
        throw new Error("Wrong defaulter");
    }
    if (decision.gainRestrictions.allowedCards.length === 0) {
        return {
            choice: {
                name: 'End Turn',
                id: ''
            }
        };
    }
    return null;
};

const chooseCardDefault = (decision: Decision) => {
    if (decision.decision !== 'chooseCard') {
        throw new Error("Wrong defaulter");
    }
    if (decision.source.length === 0) {
        return {
            name: 'No Card',
            id: 'nocard'
        };
    }
    if (decision.source.length === 1) {
        return decision.source[0];
    }
    return null;
};

const gainDefault = (decision: Decision) => {
    if (decision.decision !== 'gain') {
        throw new Error("Wrong defaulter");
    }
    if (decision.gainRestrictions.allowedCards.length === 0) {
        return {
            name: 'Gain Nothing',
            id: ''
        };
    }
    return null;
};

const reorderDefault = (decision: Decision) => {
    if (decision.decision !== 'reorder') {
        throw new Error("Wrong defaulter");
    }
    if (decision.cards.length < 2) {
        return {
            order: decision.cards
        };
    }
    return null;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols
export const DecisionDefaults = {
    chooseUsername: (decision: Decision) => null,
    chooseCardOrBuy: chooseCardOrBuyDefault,
    buy: buyDefault,
    chooseCard: chooseCardDefault,
    confirm: (decision: Decision) => null,
    gain: gainDefault,
    chooseOption: (decision: Decision) => null,
    reorder: reorderDefault
};
/* eslint-enable @typescript-eslint/no-unused-vars */

// noinspection JSUnusedLocalSymbols
type AllDecisionHaveDefaults = typeof DecisionDefaults[Decision['decision']];
export function isDecision(toTest: any): toTest is Decision {
    // noinspection SuspiciousTypeOfGuard
    return typeof toTest === 'object' &&
        typeof (toTest as Decision).decision === 'string';
}