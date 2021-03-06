import Card from "../Card";
import type Player from "../../server/Player";

export default class Gold extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "gold";
    intrinsicCost = {
        coin: 6
    };
    cardText = "+$3";
    randomizable = false;
    supplyCount = 30;
    cardArt = "/img/card-img/GoldArt.jpg";
    intrinsicValue = 3;
    async onPlay(player: Player) {
        await player.addMoney(3);
    }
}