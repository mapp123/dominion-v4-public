import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Traveller from "./Traveller.abstract";

export default class Soldier extends Traveller {
    static descriptionSize = 50;
    static typelineSize = 43;
    intrinsicTypes = ["action","attack","traveller"] as const;
    name = "soldier";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "+$1 per other Attack you have in play. Each other player with 4 or more cards in hand discards a card.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Fugitive.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/SoldierArt.jpg";
    travellerTarget = "fugitive";
    randomizable = false;
    static inSupply = false;
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.addMoney(2);
        await player.addMoney(player.data.playArea.filter((a) => a.types.includes('attack') && a.id !== this.id).length);
        await player.attackOthers(exemptPlayers, async (p) => {
            if (p.data.hand.length >= 4) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('soldier'));
                if (card) {
                    await p.discard(card);
                }
            }
        });
    }
}
