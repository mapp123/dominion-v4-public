import Card from "../Card";
import Player from "../../server/Player";

export default class Copper extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "copper";
    intrinsicCost = {
        coin: 0
    };
    cardText = "+$1";
    randomizable = false;
    cardArt = "/img/card-img/CopperArt.jpg";
    intrinsicValue = 1;
    supplyCount = (players) => 60 - (players * 7);
    protected async onTreasure(player: Player) {
        player.data.money += 1;
    }
}