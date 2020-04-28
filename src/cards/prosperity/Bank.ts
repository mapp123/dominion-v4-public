import Card from "../Card";
import type Player from "../../server/Player";

export default class Bank extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "bank";
    intrinsicCost = {
        coin: 7
    };
    cardText = "When you play this, it’s worth $1 per Treasure card you have in play (counting this).";
    supplyCount = 10;
    cardArt = "/img/card-img/BankArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.money += player.data.playArea.filter((a) => a.types.includes("treasure")).length;
    }
}
