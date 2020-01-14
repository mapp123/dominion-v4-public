import Card from "../Card";
import Player from "../../server/Player";
import Util from "../../Util";
import Tracker from "../../server/Tracker";

export default class Sage extends Card {
    intrinsicTypes = ["action"] as const;
    name = "sage";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "Reveal cards from the top of your deck until you reveal one costing $3 or more. Put that card into your hand and discard the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/SageArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        const revealedCards = [] as Array<Tracker<Card>>;
        let card: Tracker<Card> | undefined;
        while ((card = (await player.revealTop(1))[0]) != undefined) {
            if (card.viewCard().cost.coin >= 3) {
                break;
            }
            revealedCards.push(card);
        }
        player.lm('%p reveals %s.', Util.formatCardList(revealedCards.map((a) => a.viewCard().name)));
        if (card === undefined) {
            player.lm('%p has run out of cards to reveal, and draws nothing.');
        }
        else {
            player.lm('%p reveals and draws %s.', Util.formatCardList([card.viewCard().name]));
            if (card && card.hasTrack) {
                player.data.hand.push(card.exercise()!);
            }
        }
        await player.discard(Util.filterAndExerciseTrackers(revealedCards));
    }
}
