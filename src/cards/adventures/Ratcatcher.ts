import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Ratcatcher extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action","reserve"] as const;
    name = "ratcatcher";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Put this on your Tavern mat.\n" +
        "---\n" +
        "At the start of your turn, you may call this, to trash a card from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-RatcatcherArt.jpg";
    cb: any | null = null;
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.draw();
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            this.cb = player.effects.setupEffect('turnStart', 'ratcatcher', {
                compatibility: {
                    teacher: true,
                    key: true,
                    fair: true,
                    guide: true
                },
                optional: true
            }, async (remove) => {
                if (player.effects.inCompat) {
                    player.data.tavernMat.forEach((a) => {
                        if (a.card.id === tracker.viewCard().id) {
                            a.canCall = true;
                        }
                    });
                    player.events.on('decision', async () => {
                        if (player.effects.currentEffect === "turnStart" || player.isInterrupted) {
                            return true;
                        }
                        player.data.tavernMat.forEach((a) => {
                            if (a.card.id === tracker.viewCard().id) {
                                a.canCall = false;
                            }
                        });
                        return false;
                    });
                }
                else {
                    if (await player.confirmAction(Texts.doYouWantToCall('ratcatcher'))) {
                        await player.callReserve(this);
                        remove();
                    }
                }
            });
        }
    }
    async onCall(player: Player): Promise<void> {
        if (this.cb) {
            player.effects.removeEffect('turnStart', 'ratcatcher', this.cb);
        }
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('ratcatcher'), true);
        if (card) {
            await player.trash(card);
        }
    }
}
