import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Artisan extends Card {
    intrinsicTypes = ["action"] as const;
    name = "artisan";
    intrinsicCost = {
        coin: 6
    };
    cardText = "Gain a card to your hand costing up to $5.\n" +
        "Put a card from your hand onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/ArtisanArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('artisan'), false, GainRestrictions.instance().setUpToCost(Cost.create(5)), 'hand');
        const card = await player.chooseCardFromHand(Texts.chooseCardToPutOnDeck);
        if (card) {
            player.deck.cards.unshift(card);
        }
    }
}
