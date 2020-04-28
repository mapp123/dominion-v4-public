import Card from "../Card";
import type Player from "../../server/Player";

export default class Silver extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "silver";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2";
    randomizable = false;
    supplyCount = 40;
    cardArt = "/img/card-img/SilverArt.jpg";
    intrinsicValue = 2;
    async onPlay(player: Player) {
        player.data.money += 2;
    }
}