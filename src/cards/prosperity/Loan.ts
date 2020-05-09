import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import type Tracker from "../../server/Tracker";

export default class Loan extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "loan";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$1\n" +
        "When you play this, reveal cards from your deck until you reveal a Treasure. Discard it or trash it. Discard the other cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/LoanArt.jpg";
    intrinsicValue = 1;
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(1);
        let revealedCard: Tracker<Card> | undefined;
        const revealedCards: Array<Tracker<Card>> = [];
        while ((revealedCard = (await player.revealTop(1, true))[0]) != null && !revealedCard.viewCard().types.includes("treasure")) {
            revealedCards.push(revealedCard);
        }
        if (revealedCard) {
            const option = await player.chooseOption(Texts.whatToDoWith(revealedCard.viewCard().name), [Texts.discardIt, Texts.trashIt] as const);
            switch (option) {
                case 'Discard It':
                    player.lm('%p discards a revealed %s.', revealedCard.viewCard().name);
                    if (revealedCard.hasTrack) {
                        await player.discard(revealedCard.exercise()!);
                    }
                    break;
                case 'Trash It':
                    player.lm('%p trashes a revealed %s.', revealedCard.viewCard().name);
                    if (revealedCard.hasTrack) {
                        await player.trash(revealedCard.exercise()!, false);
                    }
                    break;
            }
        }
        else {
            player.lm('%p has no cards left to reveal.');
        }
        await player.discard(Util.filterAndExerciseTrackers(revealedCards));
    }
}
