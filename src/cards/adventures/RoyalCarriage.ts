import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Tracker from "../../server/Tracker";

export default class RoyalCarriage extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action","reserve"] as const;
    name = "royal carriage";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Action\n" +
        "Put this on your Tavern mat.\n" +
        "---\n" +
        "Directly after you finish playing an Action card, if it's still in play, you may call this, to replay that Action.";
    supplyCount = 10;
    cardArt = "/img/card-img/Royal_CarriageArt.jpg";
    private cardToReplay: Tracker<Card> | null = null;
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            player.effects.setupEffect('cardPlayed', this.name, {
                compatibility: {
                    merchant: true
                },
                relevant: (tracker) => tracker.viewCard().types.includes("action"),
                temporalRelevance: (tracker) => tracker.hasTrack,
                optional: true
            }, async (remove, tracker) => {
                if (tracker.hasTrack && (!player.effects.inCompat || await player.confirmAction(Texts.doYouWantToCall("royal carriage")))) {
                    this.cardToReplay = tracker;
                    remove();
                    await this.call(player);
                    return;
                }
                if (!player.data.tavernMat.some((a) => a.card.id === this.id)) {
                    remove();
                }
            });
        }
    }
    async onCall(player: Player): Promise<void> {
        player.lm('%p replays the %s.', this.cardToReplay!.viewCard().name);
        await player.playCard(this.cardToReplay!.viewCard(), this.cardToReplay!, false);
    }
}
