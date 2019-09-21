import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Cellar extends Card {
    types = ["action"] as const;
    name = "cellar";
    cost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Discard any number of cards, then draw that many.";
    supplyCount = 10;
    cardArt = "/img/card-img/CellarArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        let card;
        let cardsToDraw = 0;
        while ((card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('cellar'), true)) != null) {
            player.lm('%p discards %s.', Util.formatCardList([card.name]));
            await player.discard(card);
            cardsToDraw++;
        }
        await player.draw(cardsToDraw);
    }
}