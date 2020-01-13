import Project from "../Project";
import Player from "../../server/Player";

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
        let playerBoughtCards = false;
        player.events.on('turnStart', () => {
            playerBoughtCards = false;
            return true;
        });
        player.events.on('buy', () => {
            playerBoughtCards = true;
            return true;
        });
        player.events.on('cleanupStart', async () => {
            if (!playerBoughtCards) {
                player.lm('Exploration activates for %p.');
                player.data.coffers++;
                player.data.villagers++;
            }
            return true;
        });
    }
}