import Project from "../Project";
import Player from "../../server/Player";
import Card from "../Card";

export default class Citadel extends Project {
    cardArt = "/img/card-img/CitadelArt.jpg";
    cardText = "The first time you play an Action card during each of your turns, play it again afterwards.";
    cost = {
        coin: 8
    };
    name = "citadel";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let usedThisTurn = false;
        let cardToReplay: Card | null = null;
        player.events.on('turnStart', async () => {
            usedThisTurn = false;
            cardToReplay = null;
            return true;
        });
        player.events.on('willPlayAction', async (card) => {
            if (!usedThisTurn) {
                cardToReplay = card;
                usedThisTurn = true;
            }
            return true;
        });
        player.events.on('actionCardPlayed', async (card, tracker) => {
            if (card === cardToReplay) {
                player.lm('The citadel activates for %p.');
                await player.replayActionCard(card, tracker, true);
            }
            return true;
        });
    }
}