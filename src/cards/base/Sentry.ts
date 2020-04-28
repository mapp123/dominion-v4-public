import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Sentry extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action"] as const;
    name = "sentry";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Look at the top 2 cards of your deck. Trash and/or discard any number of them. Put the rest back on top in any order.";
    supplyCount = 10;
    cardArt = "/img/card-img/SentryArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw();
        player.data.actions++;
        const cards = await player.revealTop(2, true);
        const keptCards: Card[] = [];
        for (const card of cards) {
            const choice = await player.chooseOption(Texts.whatToDoWith(card.viewCard().name), [Texts.trashIt, Texts.discardIt, Texts.keepIt] as const);
            if (card.hasTrack) {
                switch (choice) {
                    case "Trash It":
                        await player.trash(card.exercise()!);
                        break;
                    case "Discard It":
                        await player.discard(card.exercise()!, true);
                        break;
                    case "Keep It":
                        keptCards.push(card.exercise()!);
                        break;
                }
            }
        }
        const order = await player.chooseOrder(Texts.chooseOrderOfCards, keptCards, 'Top of Deck', 'Rest of Deck');
        if (order.length > 0) player.lm('%p puts the rest of the cards on top of their deck.');
        player.deck.cards.unshift(...order);
    }
}
