import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Tracker from "../../server/Tracker";

export default class Hermit extends Card {
    static descriptionSize = 45;
    intrinsicTypes = ["action"] as const;
    name = "hermit";
    cost = {
        coin: 3
    };
    cardText = "Look through your discard pile. You may trash a non-Treasure card from your discard pile or hand. Gain a card costing up to $3.\n" +
        "---\n" +
        "When you discard this from play, if you didn't buy any cards this turn, trash this and gain a Madman from the Madman pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/HermitArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCard(Texts.chooseCardToTrashFor('hermit'), [...player.data.hand, ...player.deck.discard].filter((a) => !a.types.includes('treasure')), true);
        if (card) {
            if (player.data.hand.some((a) => a.id === card.id)) {
                player.data.hand.splice(player.data.hand.findIndex((a) => a.id === card.id), 1);
            }
            else {
                player.deck.discard.splice(player.deck.discard.findIndex((a) => a.id === card.id), 1);
            }
            await player.trash(card);
        }
        await player.chooseGain(Texts.chooseCardToGainFor('hermit'), false, GainRestrictions.instance().setMaxCoinCost(3));
    }

    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        if (player.boughtCards.length === 0 && tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
        }
        await player.gain('madman');
    }

    public static onChosen(): string[] {
        return ['madman'];
    }
}
