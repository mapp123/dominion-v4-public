import Card from "../Card";
import Player from "../../server/Player";

export default class Platinum extends Card {
    types = ["treasure"] as const;
    name = "platinum";
    cost = {
        coin: 9
    };
    cardText = "+$5";
    randomizable = false;
    supplyCount = 30;
    cardArt = "/img/card-img/PlatinumArt.jpg";
    protected async onTreasure(player: Player) {
        player.data.money += 5;
    }
}