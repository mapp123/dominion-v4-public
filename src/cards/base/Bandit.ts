import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Bandit extends Card {
    intrinsicTypes = ["action","attack"] as const;
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
            let topCards: Card[] = [await p.deck.pop(), await p.deck.pop()].filter((a) => a) as Card[];
            if (topCards.length) {
                p.lm('%p reveals %s.', Util.formatCardList(topCards.map((a) => a.name)));
                topCards = await player.reveal(topCards);
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
