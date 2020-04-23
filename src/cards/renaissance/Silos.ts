import Project from "../Project";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Silos extends Project {
    cardArt = "/img/card-img/SilosArt.jpg";
    cardText = "At the start of your turn, discard any number of Coppers, revealed, and draw that many cards.";
    intrinsicCost = {
        coin: 4
    };
    name = "silos";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'silos', {
            compatibility: {}
        }, async () => {
            player.lm('The silos activate for %p.');
            let discarded = 0;
            while (player.data.hand.some((a) => a.name === 'copper') && await player.confirmAction(Texts.doYouWantToDiscardAnAForB('copper', 'silos'))) {
                const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.name === 'copper'), 1)[0];
                await player.discard(card, true);
                discarded++;
            }
            if (discarded) {
                await player.draw(discarded);
            }
        });
    }
}