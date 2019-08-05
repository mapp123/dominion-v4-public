import Card from "../Card";
import Player from "../../server/Player";

export default class Colony extends Card {
    types = ["victory"] as const;
    name = "colony";
    cost = {
        coin: 11
    };
    cardText = "10 VP";
    randomizable = false;
    cardArt = "/img/card-img/ColonyArt.jpg";
    supplyCount = (players) => players < 3 ? 8 : players < 5 ? 12 : ((players - 4) * 3) + 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "colony").length * 10;
    }
}