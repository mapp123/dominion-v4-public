import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Bandit extends Card {
    types = ["action","attack"] as const;
    name = "bandit";
    cost = {
        coin: 5
    };
    cardText = "Gain a Gold. Each other player reveals the top 2 cards of their deck, trashes a revealed Treasure other than Copper, and discards the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/BanditArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.gain('gold');
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const topCards: Card[] = [p.deck.pop(), p.deck.pop()].filter((a) => a) as Card[];
            if (topCards.length) {
                const s = topCards.length === 1 ? `a ${topCards[0].name}` : `a ${topCards[0].name} and a ${topCards[1].name}`;
                p.lm('%p reveals %s.', s);
            }
            const chosen = await p.chooseCard(Texts.chooseATreasureToTrashFor('bandit'), topCards, false, (card) => card.types.includes("treasure") && card.name !== 'copper');
            if (chosen) {
                await p.trash(chosen);
                topCards.splice(topCards.indexOf(chosen),  1);
            }
            await p.discard(topCards);
        });
    }
}
