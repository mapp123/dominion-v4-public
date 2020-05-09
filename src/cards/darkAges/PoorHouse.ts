import Card from "../Card";
import type Player from "../../server/Player";

export default class PoorHouse extends Card {
    intrinsicTypes = ["action"] as const;
    name = "poor house";
    intrinsicCost = {
        coin: 1
    };
    cardText = "+$4\n" +
        "Reveal your hand. –$1 per Treasure card in your hand.\n" +
        "(You can't go below $0.)";
    supplyCount = 10;
    cardArt = "/img/card-img/Poor_HouseArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(4);
        await player.revealHand();
        await player.removeMoney(Math.min(player.data.money, player.data.hand.filter((a) => player.game.getTypesOfCard(a.name).includes("treasure")).length));
    }
}
