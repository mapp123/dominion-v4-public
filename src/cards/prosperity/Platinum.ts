import Card from "../Card";
import Player from "../../server/Player";

export default class Platinum extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "platinum";
    cost = {
        coin: 9
    };
    cardText = "+$5";
    randomizable = false;
    supplyCount = 30;
    cardArt = "/img/card-img/PlatinumArt.jpg";
    intrinsicValue = 5;
    protected async onTreasure(player: Player) {
        player.data.money += 5;
    }
}