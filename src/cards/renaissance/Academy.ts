import Project from "../Project";
import Player from "../../server/Player";

export default class Academy extends Project {
    cardArt = "/img/card-img/AcademyArt.jpg";
    cardText = "When you gain an Action card,\n" +
        "+1 Villager";
    intrinsicCost = {
        coin: 5
    };
    features = ["villagers"] as const;
    name = "academy";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('gain', 'academy', () => true, async (remove, tracker) => {
            if (tracker.viewCard().types.includes("action")) {
                player.data.villagers++;
            }
        });
    }
}