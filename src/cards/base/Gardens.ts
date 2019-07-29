import Card from "../Card";
import Player from "../../server/Player";

export default class Gardens extends Card {
    types = ["victory"] as const;
    name = "gardens";
    cost = {
        coin: 4
    };
    cardText = "Worth 1 VP per 10 cards you have (round down).";
    supplyCount = (players) => players < 3 ? 8 : 12;
    cardArt = "/img/card-img/GardensArt.jpg";
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === 'gardens').length * Math.floor(player.allCards.length / 10);
    }
}
