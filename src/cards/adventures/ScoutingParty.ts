import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";

export default class ScoutingParty extends Event {
    cardArt = "/img/card-img/ScoutingPartyArt.jpg";
    cardText = "+1 Buy\n" +
        "Look at the top 5 cards of your deck. Discard 3 and put the rest back in any order.";
    intrinsicCost = {
        coin: 2
    };
    name = "scouting party";
    async onPurchase(player: Player): Promise<any> {
        player.data.buys++;
        const cards = await player.revealTop(5, true);
        let cardsToDiscard = 3;
        while (cardsToDiscard > 0 && cards.length > 0) {
            const card = await player.chooseCard(Texts.chooseCardToDiscardFor(this.name), cards.map((a) => a.viewCard()));
            if (!card) {
                break;
            }
            cardsToDiscard--;
            const tracker = cards.find((a) => a.viewCard().id === card.id)!;
            cards.splice(cards.indexOf(tracker), 1);
            if (tracker.hasTrack) {
                await player.discard(tracker.exercise()!);
            }
        }
        const remaining = cards.filter((a) => a.hasTrack).map((a) => a.exercise()!);
        player.deck.cards = [...(await player.chooseOrder(Texts.chooseOrderOfCards, remaining, 'Top of Deck', 'Rest of Deck')), ...player.deck.cards];
    }
}