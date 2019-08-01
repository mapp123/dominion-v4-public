import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Thief extends Card {
    types = ["action", "attack"] as const;
    name = "thief";
    cost = {
        coin: 4
    };
    cardText = "Each other player reveals the top 2 cards of his deck. If they revealed any Treasure cards, they trash one of them that you choose. You may gain any or all of these trashed cards. They discard the other revealed cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/ThiefArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        let chosenCards: Card[] = [];
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const topCards: Card[] = [p.deck.pop(), p.deck.pop()].filter((a) => a != null) as Card[];
            if (topCards.length) {
                const s = topCards.length === 1 ? `a ${topCards[0].name}` : `a ${topCards[0].name} and a ${topCards[1].name}`;
                p.lm('%p reveals %s.', s);
            }
            let chosen = await player.chooseCard(Texts.chooseATreasureToTrashFor(p.username), topCards, false, (card) => card.types.includes("treasure"));
            if (chosen) {
                chosenCards.push(chosen);
                await p.trash(chosen);
                if (topCards.length > 1) {
                    topCards.filter((a) => a != chosen).forEach((card) => p.discard(card));
                }
            }
            else {
                await p.discard(topCards);
            }
        });
        let chosen;
        while ((chosen = await player.chooseCard(Texts.chooseCardToGainFromTrashed, chosenCards, true)) != null) {
            const grabbed = player.game.grabCard(chosen.id, "trash", true);
            if (!grabbed) {
                break;
            }
            await player.gain('', grabbed, false);
            chosenCards.splice(chosenCards.indexOf(chosen), 1);
        }
    }
}
