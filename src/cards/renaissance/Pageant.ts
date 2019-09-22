import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Pageant extends Project {
    cardArt = "/img/card-img/PageantArt.jpg";
    cardText = "At the end of your Buy phase, you may pay $1 for +1 Coffers.";
    cost = {
        coin: 3
    };
    features = ["coffers"] as const;
    name = "pageant";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.events.on('cleanupStart', async () => {
            player.lm('The pageant activates for %p.');
            if (player.data.money > 0 && await player.confirmAction(Texts.wantBuyCoffers)) {
                player.data.coffers++;
                player.data.money--;
            }
            return true;
        });
    }
}