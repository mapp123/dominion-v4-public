import {CardDef} from "../cards/CardDef";

const CardOrder = [
    "copper",
    "silver",
    "gold",
    "platinum",
    "estate",
    "duchy",
    "province",
    "colony",
    "curse"
];
export default function cardSorter(cardA: typeof CardDef, cardB: typeof CardDef) {
    if (CardOrder.includes(cardA.cardName)) {
        if (CardOrder.includes(cardB.cardName)) {
            return CardOrder.indexOf(cardA.cardName) - CardOrder.indexOf(cardB.cardName);
        }
        return -1;
    }
    else if(CardOrder.includes(cardB.cardName)) {
        return 1;
    }
    else {
        return cardB.cost.coin - cardA.cost.coin;
    }
}