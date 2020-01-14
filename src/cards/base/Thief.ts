import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Thief extends Card {
    static descriptionSize = 55;
    intrinsicTypes = ["action", "attack"] as const;
    name = "thief";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Each other player reveals the top 2 cards of his deck. If they revealed any Treasure cards, they trash one of them that you choose. You may gain any or all of these trashed cards. They discard the other revealed cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/ThiefArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        const chosenCards: Card[] = [];
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const topCards = await p.revealTop(2, true);
            const chosen = await player.chooseCard(Texts.chooseATreasureToTrashFor(p.username), topCards.map((a) => a.viewCard()), false, (card) => card.types.includes("treasure"));
            if (chosen) {
                const chosenTracker = topCards.find((a) => a.viewCard().id === chosen.id)!;
                if (chosenTracker.hasTrack) {
                    chosenCards.push(chosen);
                    await p.trash(chosenTracker.exercise()!);
                }
                await p.discard(Util.filterAndExerciseTrackers(topCards));
            }
            else {
                await p.discard(topCards.filter((a) => a.hasTrack).map((a) => a.exercise()!));
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
