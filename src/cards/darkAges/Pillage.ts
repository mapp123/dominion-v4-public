import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Pillage extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "pillage";
    cost = {
        coin: 5
    };
    cardText = "Trash this. If you did, gain 2 Spoils, and each other player with 5 or more cards in hand reveals their hand and discards a card that you choose.";
    supplyCount = 10;
    cardArt = "/img/card-img/PillageArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[], tracker): Promise<void> {
        if (tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
            await player.gain('spoils');
            await player.gain('spoils');
            await player.attackOthersInOrder(exemptPlayers, async (p) => {
                if (p.data.hand.length >= 5) {
                    const card = await player.chooseCard(Texts.chooseCardForPlayerToDiscard(p.username), p.data.hand);
                    if (card) {
                        p.data.hand.splice(p.data.hand.findIndex((a) => a.id === card.id), 1);
                        await p.discard(card, true);
                    }
                }
            });
        }
    }
    static onChosen() {
        return ['spoils'];
    }
}
