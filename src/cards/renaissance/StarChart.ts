import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import shuffle from "../../server/util/shuffle";

export default class StarChart extends Project {
    cardArt = "/img/card-img/Star_ChartArt.jpg";
    cardText = "When you shuffle, you may pick one of the cards to go on top.";
    intrinsicCost = {
        coin: 3
    };
    name = "star chart";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.events.on('shuffle', async (deck) => {
            const card = await player.chooseCard(Texts.chooseCardToPutOnDeck, deck.cards.filter((a, i, arr) => arr.findIndex((b) => a.name === b.name) === i), true);
            if (card) {
                deck.cards.splice(deck.cards.indexOf(card), 1);
                deck.cards = [card, ...shuffle(deck.cards)];
            }
            else {
                deck.cards = shuffle(deck.cards);
            }
            return true;
        });
    }
}