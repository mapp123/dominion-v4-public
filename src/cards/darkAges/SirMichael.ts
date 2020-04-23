import type Player from "../../server/Player";
import Knight from "./Knight.abstract";
import {Texts} from "../../server/Texts";

export default class SirMichael extends Knight {
    static descriptionSize = 54;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "sir michael";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Each other player discards down to 3 cards in hand. Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/800px-Sir_MichaelArt.jpg";

    async beforeKnight(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.attackOthers(exemptPlayers, async (p) => {
            while (p.data.hand.length > 3) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('sir michael'));
                if (card) {
                    await p.discard(card);
                }
            }
        });
    }
}


