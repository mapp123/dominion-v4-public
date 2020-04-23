import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Mercenary extends Card {
    static inSupply = false;
    intrinsicTypes = ["action","attack"] as const;
    name = "mercenary";
    intrinsicCost = {
        coin: 0
    };
    cardText = "You may trash 2 cards from your hand. If you did, +2 Cards, +$2, and each other player discards down to 3 cards in hand.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/MercenaryArt.jpg";
    randomizable = false;
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        let card = await player.chooseCardFromHand(Texts.trashForBenefit('+2 Cards, +$2', 2), true);
        if (card) {
            await player.trash(card);
            card = await player.chooseCardFromHand(Texts.trashForBenefit('+2 Cards, +$2', 1));
            if (card) {
                await player.trash(card);
                await player.draw(2);
                player.data.money += 2;
                await player.attackOthers(exemptPlayers, async (p) => {
                    while (p.data.hand.length > 3) {
                        const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('mercenary'));
                        if (card) {
                            await p.discard(card);
                        }
                    }
                });
            }
        }
    }
}
