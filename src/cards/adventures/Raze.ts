import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Raze extends Card {
    static descriptionSize = 56;
    intrinsicTypes = ["action"] as const;
    name = "raze";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Trash this or a card from your hand. Look at one card from the top of your deck per $1 the trashed card costs. Put one of them into your hand and discard the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/RazeArt.jpg";
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.actions++;
        const card = await player.chooseCard(Texts.chooseCardToTrashFor('raze'), [...player.data.hand, this], false, undefined, true);
        if (!card) {
            return;
        }
        if (card != this) {
            player.data.hand.splice(player.data.hand.indexOf(card), 1);
            await player.trash(card);
        }
        else {
            if (!tracker.hasTrack) {
                return;
            }
            await player.trash(tracker.exercise()!);
        }
        const lookedAt: Card[] = [];
        for (let i = 0; i < card.cost.coin; i++) {
            const c = await player.deck.pop();
            if (c) lookedAt.push(c);
        }
        const card2 = await player.chooseCard(Texts.chooseCardToTakeFromRevealed, lookedAt as Card[]);
        if (card2) {
            player.data.hand.push(card2);
            await player.discard(lookedAt.filter((a) => a != card2));
        }
    }
}
