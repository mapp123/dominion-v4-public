import Card from "../Card";
import type Player from "../../server/Player";

export default class Scholar extends Card {
    intrinsicTypes = ["action"] as const;
    name = "scholar";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Discard your hand. \n" +
        "+7 Cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScholarArt.jpg";
    async onPlay(player: Player): Promise<void> {
        const cards = player.data.hand.slice(0);
        player.data.hand = [];
        await player.discard(cards);
        await player.draw(7);
    }
}
