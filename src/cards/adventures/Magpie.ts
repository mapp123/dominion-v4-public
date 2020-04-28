import Card from "../Card";
import type Player from "../../server/Player";

export default class Magpie extends Card {
    static descriptionSize = 56;
    intrinsicTypes = ["action"] as const;
    name = "magpie";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Reveal the top card of your deck. If it's a Treasure, put it into your hand. If it's an Action or Victory card, gain a Magpie.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-MagpieArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions++;
        const [card] = await player.revealTop(1, true);
        if (card) {
            if (card.viewCard().types.includes("treasure") && card.hasTrack) {
                await player.data.hand.push(card.exercise()!);
            }
            if (card.viewCard().types.includes("action") || card.viewCard().types.includes("victory")) {
                await player.gain('magpie');
            }
            if (card.hasTrack) {
                player.deck.cards.unshift(card.exercise()!);
            }
        }
    }
}
