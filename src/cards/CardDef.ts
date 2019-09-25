import Card from "./Card";

export class CardDef extends Card {
    cardText = "";
    cost = {coin: 0};
    name = "";
    intrinsicTypes = [];
    supplyCount = 0;
    cardArt = "";
    static isCard = false;
}