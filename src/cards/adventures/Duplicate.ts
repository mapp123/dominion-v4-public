import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Cost, {CostResult} from "../../server/Cost";
import Util from "../../Util";

export default class Duplicate extends Card {
    intrinsicTypes = ["action","reserve"] as const;
    name = "duplicate";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Put this on your Tavern mat.\n" +
        "---\n" +
        "When you gain a card costing up to $6, you may call this, to gain a copy of that card.";
    supplyCount = 10;
    cardArt = "/img/card-img/DuplicateArt.jpg";
    private gainedCard: Card | null = null;
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            player.effects.setupEffect('gain', 'duplicate', {
                compatibility: {
                    "royal seal": true,
                    "watchtower": true,
                    "cargo ship": true,
                    "guildhall": true,
                    "innovation": true
                },
                relevant: (gainedCard) => gainedCard.viewCard().cost.compareTo(Cost.create(7)) === CostResult.LESS_THAN
            }, async (remove, gainedCard) => {
                if (gainedCard.viewCard().cost.compareTo(Cost.create(7)) === CostResult.LESS_THAN
                    && gainedCard.viewCard().inSupply
                    && player.data.tavernMat.some((a) => a.card.id === this.id) // Covers edge case where you get here after a stack of duplicates
                    && await player.confirmAction(Texts.doYouWantToCallXForY('duplicate', `gain ${Util.formatTrackerList([gainedCard])}`))) {
                    remove();
                    this.gainedCard = gainedCard.viewCard();
                    await this.call(player);
                }
            });
        }
    }
    async onCall(player: Player): Promise<void> {
        player.lm('%p calls their duplicate.');
        await player.gain(this.gainedCard!.name);
        this.gainedCard = null;
    }
}
