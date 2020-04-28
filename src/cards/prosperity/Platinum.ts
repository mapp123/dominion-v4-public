import Card from "../Card";
import type Player from "../../server/Player";

export default class Platinum extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "platinum";
    intrinsicCost = {
        coin: 9
    };
    cardText = "+$5";
    randomizable = false;
    supplyCount = 30;
    cardArt = "/img/card-img/PlatinumArt.jpg";
    intrinsicValue = 5;
    async onPlay(player: Player) {
        player.data.money += 5;
    }
}