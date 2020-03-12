import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Guide extends Card {
    intrinsicTypes = ["action","reserve"] as const;
    name = "guide";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Put this on your Tavern mat.\n" +
        "---\n" +
        "At the start of your turn, you may call this, to discard your hand and draw 5 cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-GuideArt.jpg";
    cb: any | null = null;
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.draw();
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                canCall: false,
                card: tracker.exercise()!
            });
            this.cb = async (remove) => {
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
                    if (await player.confirmAction(Texts.doYouWantToCall('guide'))) {
                        await player.callReserve(this);
                        remove();
                    }
                }
            };
            player.effects.setupEffect('turnStart', 'guide', {
                teacher: true,
                ratcatcher: true
            }, this.cb);
        }
    }
    async onCall(player: Player) {
        if (this.cb) {
            player.effects.removeEffect('turnStart', 'ratcatcher', this.cb);
        }
        await player.discard(player.data.hand);
        player.data.hand = [];
        await player.draw(5);
    }
}
