import Card from "../Card";
import Player from "../../server/Player";

export default class Curse extends Card {
    types = ["curse"] as const;
    name = "curse";
    cost = {
        coin: 0
    };
    cardText = "-1 VP";
    randomizable = false;
    cardArt = "/img/curse.png";
    supplyCount = (players) => (players - 1) * 10;
    onScore(player: Player): number {
        return -player.allCards.filter((a) => a.name === "curse").length;
    }
}