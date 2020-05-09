import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Cellar extends Card {
    intrinsicTypes = ["action"] as const;
    name = "cellar";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Discard any number of cards, then draw that many.";
    supplyCount = 10;
    cardArt = "/img/card-img/CellarArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.actions++;
        let card;
        let cardsToDraw = 0;
        while ((card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('cellar'), true)) != null) {
            player.lm('%p discards %s.', Util.formatCardList([card.name]));
            await player.discard(card);
            cardsToDraw++;
        }
        await player.draw(cardsToDraw, false);
    }
}