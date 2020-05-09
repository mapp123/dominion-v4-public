import Card from "../Card";
import type Player from "../../server/Player";
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
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.draw(1, true);
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            this.allowCallAtEvent(player, tracker, 'turnStart', {
                compatibility: {
                    teacher: true,
                    key: true,
                    fair: true,
                    guide: true
                }
            });
        }
    }
    async onCall(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('ratcatcher'), true);
        if (card) {
            await player.trash(card);
        }
    }
}
