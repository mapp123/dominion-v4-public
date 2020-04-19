import Project from "../Project";
import Player from "../../server/Player";

export default class Fair extends Project {
    cardArt = "/img/card-img/FairArt.jpg";
    cardText = "At the start of your turn,\n" +
        "+1 Buy";
    intrinsicCost = {
        coin: 4
    };
    name = "fair";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'fair', {
            compatibility: () => true
        }, async () => {
            player.data.buys++;
        });
    }
}