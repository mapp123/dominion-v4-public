import Project from "../Project";
import Player from "../../server/Player";

export default class Barracks extends Project {
    cardArt = "/img/card-img/BarracksArt.jpg";
    cardText = "At the start of your turn,\n" +
        "+1 Action.";
    intrinsicCost = {
        coin: 6
    };
    name = "barracks";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'barracks', () => true, async () => {
            player.data.actions++;
        });
    }
}