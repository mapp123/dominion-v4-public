import Project from "../Project";
import Player from "../../server/Player";
import Util from "../../Util";

export default class Piazza extends Project {
    cardArt = "/img/card-img/PiazzaArt.jpg";
    cardText = "At the start of your turn, reveal the top card of your deck. If it's an Action, play it.";
    intrinsicCost = {
        coin: 5
    };
    name = "piazza";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'piazza', () => false, async () => {
            let card = (await player.revealTop(1))[0];
            if (card) {
                player.lm('The piazza activates for %p, who reveals %s.', Util.formatCardList([card.viewCard().name]));
            }
            if (card && card.viewCard().types.includes("action")) {
                if (card.hasTrack) {
                    player.data.playArea.push(card.exercise()!);
                    card = player.getTrackerInPlay(card.viewCard());
                }
                await player.playActionCard(card.viewCard(), card, true);
            }
            else if (card && card.hasTrack) {
                player.deck.cards.unshift(card.exercise()!);
            }
        });
    }
}