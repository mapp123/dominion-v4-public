import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Cellar extends Card {
    types = ["action"] as const;
    name = "cellar";
    cost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Discard any number of cards, then draw that many.";
    supplyCount = 10;
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        let card;
        let cardsToDraw = 0;
        while ((card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('cellar'), true)) != null) {
            player.lm('%p discards a %s.', card.name);
            await player.discard(card);
            cardsToDraw++;
        }
        player.draw(cardsToDraw);
    }
}