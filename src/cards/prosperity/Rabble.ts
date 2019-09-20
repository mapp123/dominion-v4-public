import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Rabble extends Card {
    types = ["action","attack"] as const;
    name = "rabble";
    cost = {
        coin: 5
    };
    cardText = "+3 Cards\n" +
        "Each other player reveals the top 3 cards of their deck, discards the Actions and Treasures, and puts the rest back in any order they choose.";
    supplyCount = 10;
    cardArt = "/img/card-img/RabbleArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.draw(3);
        await player.attackOthers(exemptPlayers, async (p) => {
            let cards = [p.deck.pop(), p.deck.pop(), p.deck.pop()].filter((a) => a != null) as Card[];
            p.lm('%p reveals %s.', Util.formatCardList(cards.map((a) => a.name)));
            cards = await player.reveal(cards);
            await p.discard(cards.filter((a) => a.types.includes("action") || a.types.includes("treasure")));
            const rest = await p.chooseOrder(Texts.chooseOrderOfCards, cards.filter((a) => !a.types.includes("action") && !a.types.includes("treasure")), 'Top of Deck', 'Rest of Deck');
            p.deck.cards.unshift(...rest);
        });
    }
}
