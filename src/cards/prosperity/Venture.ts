import Card from "../Card";
import type Player from "../../server/Player";
import Util from "../../Util";
import type Tracker from "../../server/Tracker";

export default class Venture extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "venture";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$1\n" +
        "When you play this, reveal cards from your deck until you reveal a Treasure. Discard the other cards. Play that Treasure.";
    supplyCount = 10;
    cardArt = "/img/card-img/VentureArt.jpg";
    intrinsicValue = 1;
    async onPlay(player: Player): Promise<void> {
        player.data.money += 1;
        let revealedCard: Tracker<Card> | undefined;
        const revealedCards: Array<Tracker<Card>> = [];
        while ((revealedCard = (await player.revealTop(1))[0]) != null && !revealedCard.viewCard().types.includes("treasure")) {
            revealedCards.push(revealedCard);
        }
        player.lm('%p reveals %s.', Util.formatTrackerList([...revealedCards, revealedCard]));
        await player.discard(Util.filterAndExerciseTrackers(revealedCards));
        if (revealedCard) {
            player.lm('%p plays the revealed %s.', revealedCard.viewCard().name);
            if (revealedCard.hasTrack) {
                player.data.playArea.push(revealedCard.exercise()!);
                revealedCard = player.getTrackerInPlay(revealedCard.viewCard());
            }
            await player.playCard(revealedCard.viewCard(), revealedCard, false);
        }
    }
}
