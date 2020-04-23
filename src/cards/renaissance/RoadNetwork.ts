import Project from "../Project";
import type Player from "../../server/Player";

export default class RoadNetwork extends Project {
    cardArt = "/img/card-img/Road_NetworkArt.jpg";
    cardText = "When another player gain a Victory card,\n" +
        "+1 Card";
    intrinsicCost = {
        coin: 5
    };
    name = "road network";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.game.events.on('gain', async (p, tracker) => {
            // Must be other player
            if (player !== p && tracker.viewCard().types.includes("victory")) {
                player.lm('Road Network activates for %p.');
                await player.draw(1);
            }
            return true;
        });
    }
}