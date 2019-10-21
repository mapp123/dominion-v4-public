import Card from "../Card";
import Player from "../../server/Player";
import Util from "../../Util";

export default class Sage extends Card {
    intrinsicTypes = ["action"] as const;
    name = "sage";
    cost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "Reveal cards from the top of your deck until you reveal one costing $3 or more. Put that card into your hand and discard the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/SageArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        let revealedCards = [] as Card[];
        let card: Card | undefined;
        while ((card = await player.deck.pop()) != undefined) {
            if (card.cost.coin >= 3) {
                break;
            }
            revealedCards.push(card);
        }
        player.lm('%p reveals %s.', Util.formatCardList(revealedCards.map((a) => a.name)));
        revealedCards = await player.reveal(revealedCards);
        if (card === undefined) {
            player.lm('%p has run out of cards to reveal, and draws nothing.');
        }
        else {
            player.lm('%p reveals and draws %s.', Util.formatCardList([card.name]));
            card = (await player.reveal([card]))[0];
            if (card) {
                player.data.hand.push(card);
            }
        }
        await player.discard(revealedCards);
    }
}
