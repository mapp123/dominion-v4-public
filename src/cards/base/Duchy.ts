import Card from "../Card";
import Player from "../../server/Player";

export default class Duchy extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "duchy";
    cost = {
        coin: 5
    };
    cardText = "3 VP";
    randomizable = false;
    cardArt = "/img/card-img/DuchyArt.jpg";
    supplyCount = (players) => players < 3 ? 8 : 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "duchy").length * 3;
    }
}