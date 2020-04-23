import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Cost from "../../server/Cost";

export default class Villain extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "villain";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Coffers\n" +
        "Each other player with 5 or more cards in hand discards one costing $2 or more (or reveals they can't).";
    supplyCount = 10;
    features = ["coffers"] as const;
    cardArt = "/img/card-img/VillainArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.coffers += 2;
        await player.attackOthers(exemptPlayers, async (p) => {
            if (p.data.hand.some((a) => player.game.getCostOfCard(a.name).coin >= 2)) {
                const lowerLimit = Cost.create(2);
                const card = await p.chooseCard(Texts.chooseCardToDiscardFor('villain'), p.data.hand.filter((a) => a.cost.isInRange(lowerLimit, null)));
                if (card) {
                    p.data.hand.splice(p.data.hand.findIndex((a) => a.id === card.id), 1);
                    await p.discard(card, true);
                }
            }
            else {
                p.lm('%p has no cards costing $2 or more.');
                await player.revealHand();
            }
        });
    }
}
