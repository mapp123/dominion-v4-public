import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class WanderingMinstrel extends Card {
    static nameSize = 66;
    intrinsicTypes = ["action"] as const;
    name = "wandering minstrel";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "Reveal the top 3 cards of your deck. Put the Action cards back in any order and discard the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/Wandering_MinstrelArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(1, true);
        player.data.actions += 2;
        const cards = await player.revealTop(3);
        const actions = cards.filter((a) => a.viewCard().types.includes("action"));
        await player.discard(cards.filter((a) => !a.viewCard().types.includes("action") && a.hasTrack).map((a) => a.exercise()!));
        const order = await player.chooseOrder(Texts.chooseOrderOfCards, actions.filter((a) => a.hasTrack).map((a) => a.exercise()!), 'Top of Deck', 'Bottom of Deck');
        player.deck.cards = [...order, ...player.deck.cards];
    }
}
