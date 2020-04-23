import Card from "../Card";
import type Player from "../../server/Player";

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
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.draw();
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                canCall: false,
                card: tracker.exercise()!
            });
            this.allowCallAtEvent(player, tracker, 'turnStart', {
                compatibility: {
                    teacher: true,
                    ratcatcher: true
                }
            });
        }
    }
    async onCall(player: Player) {
        await player.discard(player.data.hand);
        player.data.hand = [];
        await player.draw(5);
    }
}
