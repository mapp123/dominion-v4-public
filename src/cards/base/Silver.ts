import Card from "../Card";
import Player from "../../server/Player";

export default class Silver extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "silver";
    cost = {
        coin: 3
    };
    cardText = "+$2";
    randomizable = false;
    supplyCount = 40;
    cardArt = "/img/card-img/SilverArt.jpg";
    intrinsicValue = 2;
    protected async onTreasure(player: Player) {
        player.data.money += 2;
    }
}