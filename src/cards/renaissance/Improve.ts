import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Improve extends Card {
    static descriptionSize = 59;
    intrinsicTypes = ["action"] as const;
    name = "improve";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "At the start of Clean-up, you may trash an Action card you would discard from play this turn, to gain a card costing exactly $1 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/ImproveArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        player.effects.setupEffect('cleanupStart', 'improve', {
            compatibility: {},
            temporalRelevance: () => player.data.playArea.some((a) => a.types.includes('action'))
        }, async (remove) => {
            const choices = player.data.playArea.filter((a) => a.types.includes('action') && a.shouldDiscardFromPlay());
            const card = await player.chooseCard(Texts.chooseCardToTrashFor('improve'), choices, true);
            if (card) {
                player.lm('%p\'s improve activates.');
                player.data.playArea.splice(player.data.playArea.indexOf(card), 1);
                await player.trash(card);
                await player.chooseGain(Texts.chooseCardToGainFor('improve'), false, GainRestrictions.instance().setExactCost(card.cost.augmentBy(Cost.create(1))));
            }
            remove();
        });
    }
}
