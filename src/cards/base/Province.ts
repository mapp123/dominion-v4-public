import Card from "../Card";
import type Player from "../../server/Player";

export default class Duchy extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "province";
    intrinsicCost = {
        coin: 8
    };
    cardText = "6 VP";
    randomizable = false;
    cardArt = "/img/card-img/ProvinceArt.jpg";
    supplyCount = (players) => players < 3 ? 8 : players < 5 ? 12 : ((players - 4) * 3) + 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "province").length * 6;
    }
}