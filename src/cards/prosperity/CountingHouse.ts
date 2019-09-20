import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class CountingHouse extends Card {
    types = ["action"] as const;
    name = "counting house";
    cost = {
        coin: 5
    };
    cardText = "Look through your discard pile, reveal any number of Coppers from it, and put them into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/Counting_HouseArt.jpg";
    async onAction(player: Player): Promise<void> {
        let card: Card | null;
        while ((card = await player.chooseCard(Texts.chooseCardToTakeFromDiscard, player.deck.discard.filter((a) => a.name === 'copper'), true)) != null) {
            player.deck.discard.splice(player.deck.discard.indexOf(card), 1);
            card = (await player.reveal([card]))[0];
            if (!card) {
                continue;
            }
            player.lm('%p puts a copper into their hand.');
            player.data.hand.push(card);
        }
    }
}
