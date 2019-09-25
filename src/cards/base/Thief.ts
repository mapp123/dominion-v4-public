import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Thief extends Card {
    intrinsicTypes = ["action", "attack"] as const;
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
            let topCards: Card[] = [await p.deck.pop(), await p.deck.pop()].filter((a) => a != null) as Card[];
            if (topCards.length) {
                p.lm('%p reveals %s.', Util.formatCardList(topCards.map((a) => a.name)));
                topCards = await p.reveal(topCards);
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
