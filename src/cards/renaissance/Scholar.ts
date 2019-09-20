import Card from "../Card";
import Player from "../../server/Player";

export default class Scholar extends Card {
    types = ["action"] as const;
    name = "scholar";
    cost = {
        coin: 5
    };
    cardText = "Discard your hand. \n" +
        "+7 Cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScholarArt.jpg";
    async onAction(player: Player): Promise<void> {
        const cards = player.data.hand.slice(0);
        player.data.hand = [];
        await player.discard(cards);
        await player.draw(7);
    }
}
