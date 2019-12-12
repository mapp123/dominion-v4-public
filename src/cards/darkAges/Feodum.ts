import Card from "../Card";
import Player from "../../server/Player";

export default class Feodum extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "feodum";
    cost = {
        coin: 4
    };
    cardText = "Worth 1VP per 3 Silvers you have (round down).";
    supplyCount = 10;
    cardArt = "/img/card-img/FeodumArt.jpg";
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === 'feodum').length * Math.floor(player.allCards.filter((a) => a.name === 'silver').length / 3);
    }
}
