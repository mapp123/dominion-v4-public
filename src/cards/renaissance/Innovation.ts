import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Innovation extends Project {
    cardArt = "/img/card-img/InnovationArt.jpg";
    cardText = "The first time you gain an Action card in each of your turns, you may set it aside. If you do, play it.";
    cost = {
        coin: 6
    };
    name = "innovation";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let usedThisTurn = false;
        player.events.on('turnStart', async () => {
            usedThisTurn = false;
            return true;
        });
        player.events.on('gain', async (card, hasTrack, loseTrack) => {
            if (!usedThisTurn && card.types.includes("action")) {
                usedThisTurn = true;
                if (hasTrack.hasTrack && await player.confirmAction(Texts.wouldYouLikeToSetAsideThe(card.name, "innovation"))) {
                    loseTrack();
                    player.data.playArea.push(card);
                    await player.playActionCard(card);
                }
            }
            return true;
        });
    }
}