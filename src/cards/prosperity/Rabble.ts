import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Rabble extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action","attack"] as const;
    name = "rabble";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+3 Cards\n" +
        "Each other player reveals the top 3 cards of their deck, discards the Actions and Treasures, and puts the rest back in any order they choose.";
    supplyCount = 10;
    cardArt = "/img/card-img/RabbleArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(3);
        await player.attackOthers(exemptPlayers, async (p) => {
            const cards = await p.revealTop(3, true);
            await p.discard(Util.filterAndExerciseTrackers(cards.filter((a) => a.viewCard().types.includes("action") || a.viewCard().types.includes("treasure"))));
            const rest = await p.chooseOrder(Texts.chooseOrderOfCards, cards.map((a) => a.viewCard()).filter((a) => !a.types.includes("action") && !a.types.includes("treasure")), 'Top of Deck', 'Rest of Deck');
            p.deck.cards.unshift(...Util.filterAndExerciseTrackers(rest.map((a) => cards.find((b) => b.viewCard().id === a.id)!)));
        });
    }
}
