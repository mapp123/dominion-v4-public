import Card from "../Card";
import Player from "../../server/Player";
import {Decision} from "../../server/Decision";

export default class Silver extends Card {
    types = ["treasure"] as const;
    name = "silver";
    cost = {
        coin: 3
    };
    cardText = "+2 Money";
    randomizable = false;
    supplyCount = 40;
    protected async onTreasure(player: Player) {
        player.data.money += 2;
    }
}