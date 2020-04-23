import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Bandit extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "bandit";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Gain a Gold. Each other player reveals the top 2 cards of their deck, trashes a revealed Treasure other than Copper, and discards the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/BanditArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.gain('gold');
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const topCards = await p.revealTop(2, true);
            const chosen = await p.chooseCard(Texts.chooseATreasureToTrashFor('bandit'), topCards.filter((a) => a.hasTrack).map((a) => a.viewCard()), false, (card) => card.types.includes("treasure") && card.name !== 'copper');
            if (chosen) {
                const chosenTracker = topCards.find((a) => a.viewCard().id === chosen.id)!;
                if (chosenTracker.hasTrack) {
                    await p.trash(chosenTracker.exercise()!);
                }
            }
            await p.discard(Util.filterAndExerciseTrackers(topCards));
        });
    }
}
