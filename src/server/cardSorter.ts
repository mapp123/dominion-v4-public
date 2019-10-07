import {CardImplementation} from "../cards/Card";

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
export default function cardSorter(cardA: CardImplementation, cardB: CardImplementation) {
    if (CardOrder.includes(cardA.cardName)) {
        if (CardOrder.includes(cardB.cardName)) {
            return CardOrder.indexOf(cardA.cardName) - CardOrder.indexOf(cardB.cardName);
        }
        return -1;
    }
    else if(CardOrder.includes(cardB.cardName)) {
        return 1;
    }
    else if (cardA.inSupply && !cardB.inSupply) {
        return -1;
    }
    else if (cardB.inSupply && !cardA.inSupply) {
        return 1;
    }
    else {
        return cardB.cost.coin - cardA.cost.coin;
    }
}