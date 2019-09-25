import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Sentry extends Card {
    intrinsicTypes = ["action"] as const;
    name = "sentry";
    cost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Look at the top 2 cards of your deck. Trash and/or discard any number of them. Put the rest back on top in any order.";
    supplyCount = 10;
    cardArt = "/img/card-img/SentryArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions++;
        let cards = [await player.deck.pop(), await player.deck.pop()].filter((a) => a) as Card[];
        if (cards.length) {
            player.lm('%p reveals %s.', Util.formatCardList(cards.map((a) => a.name)));
            cards = await player.reveal(cards);
        }
        let keptCards: Card[] = [];
        for (let card of cards) {
            const choice = await player.chooseOption(Texts.whatToDoWith(card.name), [Texts.trashIt, Texts.discardIt, Texts.keepIt] as const);
            switch (choice) {
                case "Trash It":
                    await player.trash(card);
                    break;
                case "Discard It":
                    player.lm('%p discards the %s.', card.name);
                    await player.discard(card);
                    break;
                case "Keep It":
                    keptCards.push(card);
                    break;
            }
        }
        const order = await player.chooseOrder(Texts.chooseOrderOfCards, keptCards, 'Top of Deck', 'Rest of Deck');
        if (order.length > 0) player.lm('%p puts the rest of the cards on top of their deck.');
        player.deck.cards.unshift(...order);
    }
}
