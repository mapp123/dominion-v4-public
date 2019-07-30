import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Sentry extends Card {
    types = ["action"] as const;
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
        player.draw();
        player.data.actions++;
        const cards = [player.deck.pop(), player.deck.pop()].filter((a) => a) as Card[];
        if (cards.length) {
            const s = cards.length === 1 ? `a ${cards[0].name}` : `a ${cards[0].name} and a ${cards[1].name}`;
            player.lm('%p reveals %s.', s);
        }
        let keptCards: Card[] = [];
        for (let card of cards) {
            const choice = await player.chooseOption(Texts.whatToDoWith(card.name), ['Trash It', 'Discard It', 'Keep It'] as const);
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