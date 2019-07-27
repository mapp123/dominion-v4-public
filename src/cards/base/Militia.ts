import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Militia extends Card {
    types = ["action","attack"] as const;
    name = "militia";
    cost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "Each other player discards down to 3 cards in hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/MilitiaArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.money += 2;
        await player.attackOthers(exemptPlayers, async (p) => {
            while (p.data.hand.length > 3) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('militia'));
                if (card) {
                    p.lm('%p discards a %s.', card.name);
                    await p.discard(card);
                }
            }
        });
    }
}
