import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Loan extends Card {
    types = ["treasure"] as const;
    name = "loan";
    cost = {
        coin: 3
    };
    cardText = "+$1\n" +
        "When you play this, reveal cards from your deck until you reveal a Treasure. Discard it or trash it. Discard the other cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/LoanArt.jpg";
    protected async onTreasure(player: Player): Promise<void> {
        player.data.money += 1;
        let revealedCard: Card | undefined;
        let revealedCards: Card[] = [];
        while ((revealedCard = player.deck.pop()) != null && !revealedCard.types.includes("treasure")) {
            player.lm('%p reveals a %s.', revealedCard.name);
            revealedCards.push(revealedCard);
        }
        if (revealedCard) {
            const option = await player.chooseOption(Texts.whatToDoWith(revealedCard.name), ['Discard It', 'Trash It'] as const);
            switch (option) {
                case 'Discard It':
                    player.lm('%p discards a revealed %s.', revealedCard.name);
                    await player.discard(revealedCard);
                    break;
                case 'Trash It':
                    player.lm('%p trashes a revealed %s.', revealedCard.name);
                    await player.trash(revealedCard, false);
                    break;
            }
        }
        else {
            player.lm('%p has no cards left to reveal.');
        }
        await player.discard(revealedCards);
    }
}
