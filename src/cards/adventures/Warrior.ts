import type Player from "../../server/Player";
import Cost from "../../server/Cost";
import Traveller from "./Traveller.abstract";

export default class Warrior extends Traveller {
    static descriptionSize = 45;
    static typelineSize = 43;
    intrinsicTypes = ["action","attack","traveller"] as const;
    name = "warrior";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+2 Cards\n" +
        "Once per Traveller you have in play (including this), each other player discards the top card of their deck and trashes it if it costs $3 or $4.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Hero.\n" +
        "(This is not in the Supply.)";
    supplyCount = 5;
    cardArt = "/img/card-img/800px-WarriorArt.jpg";
    randomizable = false;
    static inSupply = false;
    travellerTarget = "hero";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(2, true);
        const travellersInPlay = player.data.playArea.filter((a) => a.types.includes("traveller")).length;
        const lowerBound = Cost.create(3);
        const upperBound = Cost.create(4);
        for (let i = 0; i < travellersInPlay; i++) {
            await player.attackOthers(exemptPlayers, async (p) => {
                const card = (await p.revealTop(1, true))[0];
                if (!card.hasTrack) {
                    return;
                }
                if (card.viewCard().cost.isInRange(lowerBound, upperBound)) {
                    await p.trash(card.exercise()!);
                }
                else {
                    await p.discard(card.exercise()!, true);
                }
            });
        }
    }
}
