import Project from "../Project";
import Player from "../../server/Player";

export default class RoadNetwork extends Project {
    cardArt = "/img/card-img/Road_NetworkArt.jpg";
    cardText = "When another player gain a Victory card,\n" +
        "+1 Card";
    cost = {
        coin: 5
    };
    name = "road network";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.game.events.on('gain', async (p, card) => {
            // Must be other player
            if (player !== p && card.types.includes("victory")) {
                player.lm('Road Network activates for %p.');
                await player.draw(1);
            }
            return true;
        });
    }
}