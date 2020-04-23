import Card from "../Card";
import type Player from "../../server/Player";

export default class Curse extends Card {
    intrinsicTypes = ["curse"] as const;
    name = "curse";
    intrinsicCost = {
        coin: 0
    };
    cardText = "-1 VP";
    randomizable = false;
    cardArt = "/img/curse.png";
    supplyCount = (players) => (players - 1) * 10;
    static onScore(player: Player): number {
        return -player.allCards.filter((a) => a.name === "curse").length;
    }
}