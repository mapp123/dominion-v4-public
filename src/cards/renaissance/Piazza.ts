import Project from "../Project";
import Player from "../../server/Player";
import Util from "../../Util";

export default class Piazza extends Project {
    cardArt = "/img/card-img/PiazzaArt.jpg";
    cardText = "At the start of your turn, reveal the top card of your deck. If it's an Action, play it.";
    cost = {
        coin: 5
    };
    name = "piazza";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.events.on('turnStart', async () => {
            let card = await player.deck.pop();
            if (card) {
                player.lm('The piazza activates for %p, who reveals %s.', Util.formatCardList([card.name]));
                card = (await player.reveal([card]))[0];
            }
            if (card && card.types.includes("action")) {
                player.data.playArea.push(card);
                await player.playActionCard(card, null, true);
            }
            else if (card) {
                player.deck.cards.unshift(card);
            }
            return true;
        });
    }
}