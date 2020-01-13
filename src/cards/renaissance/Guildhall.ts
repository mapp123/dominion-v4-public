import Project from "../Project";
import Player from "../../server/Player";

export default class Guildhall extends Project {
    cardArt = "/img/card-img/GuildhallArt.jpg";
    cardText = "When you gain a Treasure,\n" +
        "+1 Coffers";
    intrinsicCost = {
        coin: 5
    };
    name = "guildhall";
    features = ["coffers"] as const;
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.events.on('gain', async (tracker) => {
            if (tracker.viewCard().types.includes("treasure")) {
                player.data.coffers++;
            }
            return true;
        });
    }
}