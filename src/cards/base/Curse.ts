import Card from "../Card";
import Player from "../../server/Player";

export default class Estate extends Card {
    types = ["curse"] as const;
    name = "curse";
    cost = {
        coin: 0
    };
    cardText = "-1 VP";
    randomizable = false;
    supplyCount = (players) => (players - 1) * 10;
    onScore(player: Player): number {
        return -player.allCards.filter((a) => a.name === "curse").length;
    }
}