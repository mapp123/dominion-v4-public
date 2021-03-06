import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Militia extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "militia";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "Each other player discards down to 3 cards in hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/MilitiaArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.addMoney(2);
        await player.attackOthers(exemptPlayers, async (p) => {
            while (p.data.hand.length > 3) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('militia'));
                if (card) {
                    p.lm('%p discards %s.', Util.formatCardList([card.name]));
                    await p.discard(card);
                }
            }
        });
    }
}
