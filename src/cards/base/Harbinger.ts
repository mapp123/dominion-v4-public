import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Harbinger extends Card {
    intrinsicTypes = ["action"] as const;
    name = "harbinger";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Look through your discard pile. You may put a card from it onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/HarbingerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        const card = await player.chooseCardFromDiscard(Texts.chooseCardToMoveFromDiscardToDeck('harbinger'), true);
        if (card) {
            player.lm('%p puts %ac on top of their deck.', Util.formatCardList([card.name]));
            player.deck.cards.unshift(card);
        }
    }
}