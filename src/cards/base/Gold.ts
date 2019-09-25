import Card from "../Card";
import Player from "../../server/Player";

export default class Gold extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "gold";
    cost = {
        coin: 6
    };
    cardText = "+$3";
    randomizable = false;
    supplyCount = 30;
    cardArt = "/img/card-img/GoldArt.jpg";
    protected async onTreasure(player: Player) {
        player.data.money += 3;
    }
}