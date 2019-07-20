import Card from "../Card";
import Player from "../../server/Player";

export default class Estate extends Card {
    types = ["victory"] as const;
    name = "estate";
    cost = {
        coin: 2
    };
    cardText = "1 VP";
    randomizable = false;
    supplyCount = (players) => players < 3 ? 8 : 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "estate").length;
    }
}