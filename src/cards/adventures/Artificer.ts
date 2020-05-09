import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Cost from "../../server/Cost";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Artificer extends Card {
    static descriptionSize = 55;
    intrinsicTypes = ["action"] as const;
    name = "artificer";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+$1\n" +
        "Discard any number of cards. You may gain a card onto your deck costing exactly $1 per card discarded.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-ArtificerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(1, true);
        player.data.actions += 1;
        player.data.money += 1;
        let discardedCards = 0;
        let card: Card | null;
        while ((card = await player.chooseCardFromHand(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), true)) != null) {
            await player.discard(card);
            discardedCards++;
        }
        await player.chooseGain(Texts.chooseCardToGainFor(this.name), true, GainRestrictions.instance().setUpToCost(Cost.create(discardedCards)), 'deck');
    }
}
