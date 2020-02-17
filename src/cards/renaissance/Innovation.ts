import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Innovation extends Project {
    cardArt = "/img/card-img/InnovationArt.jpg";
    cardText = "The first time you gain an Action card in each of your turns, you may set it aside. If you do, play it.";
    intrinsicCost = {
        coin: 6
    };
    name = "innovation";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let usedThisTurn = false;
        player.events.on('turnStart', async () => {
            usedThisTurn = false;
            return true;
        });
        player.effects.setupEffect('gain', 'innovation', (other, tracker) => usedThisTurn || !tracker.viewCard().types.includes("action"), async (remove, tracker) => {
            if (!usedThisTurn && tracker.viewCard().types.includes("action")) {
                usedThisTurn = true;
                if (tracker.hasTrack && await player.confirmAction(Texts.wouldYouLikeToSetAsideThe(tracker.viewCard().name, "innovation"))) {
                    const card = tracker.exercise()!;
                    player.data.playArea.push(card);
                    await player.playActionCard(card, null);
                }
            }
        });
    }
}