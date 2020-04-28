import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Poacher extends Card {
    intrinsicTypes = ["action"] as const;
    name = "poacher";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+$1\n" +
        "Discard a card per empty supply pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/PoacherArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        player.data.money += 1;
        const empty = player.game.supply.pilesEmpty;
        for (let i = 0; i < empty; i++) {
            const card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('poacher'));
            if (card) {
                player.lm('%p discards %s.', Util.formatCardList([card.name]));
                await player.discard(card);
            }
        }
    }
}
