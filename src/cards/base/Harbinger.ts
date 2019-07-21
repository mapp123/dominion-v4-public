import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Harbinger extends Card {
    types = ["action"] as const;
    name = "harbinger";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Look through your discard pile. You may put a card from it onto your deck.";
    supplyCount = 10;
    async onAction(player: Player): Promise<void> {
        player.draw(1);
        player.data.actions++;
        const card = await player.chooseCardFromDiscard(Texts.chooseCardToMoveFromDiscardToDeck('harbinger'), true);
        if (card) {
            player.lm('%p puts a %c on top of their deck.', card.name);
            player.deck.cards.unshift(card);
        }
    }
}