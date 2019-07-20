import Card from "../Card";
import Player from "../../server/Player";
import {Decision} from "../../server/Decision";

export default class Gold extends Card {
    types = ["treasure"] as const;
    name = "gold";
    cost = {
        coin: 6
    };
    cardText = "+3 Money";
    randomizable = false;
    supplyCount = 30;
    protected async onTreasure(player: Player) {
        player.data.money += 3;
    }
}