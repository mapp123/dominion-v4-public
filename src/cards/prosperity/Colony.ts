import Card from "../Card";
import type Player from "../../server/Player";

export default class Colony extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "colony";
    intrinsicCost = {
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