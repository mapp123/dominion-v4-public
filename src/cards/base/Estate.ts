import Card from "../Card";
import Player from "../../server/Player";

export default class Estate extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "estate";
    intrinsicCost = {
        coin: 2
    };
    cardText = "1 VP";
    randomizable = false;
    cardArt = "/img/card-img/EstateArt.jpg";
    supplyCount = (players) => players < 3 ? 8 : 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "estate").length;
    }
}