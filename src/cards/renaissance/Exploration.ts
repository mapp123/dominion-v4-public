import Project from "../Project";
import type Player from "../../server/Player";

export default class Exploration extends Project {
    cardArt = "/img/card-img/ExplorationArt.jpg";
    cardText = "At the end of your Buy phase, if you didn't buy any cards,\n" +
        "+1 Coffers, +1 Villager";
    intrinsicCost = {
        coin: 4
    };
    name = "exploration";
    features = ["coffers", "villagers"] as const;
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('cleanupStart', 'exploration', {
            compatibility: () => true,
            relevant: () => player.boughtCards.every((a) => !a.isCard)
        }, async () => {
            if (player.boughtCards.every((a) => !a.isCard)) {
                player.lm('Exploration activates for %p.');
                player.data.coffers++;
                player.data.villagers++;
            }
        });
    }
}