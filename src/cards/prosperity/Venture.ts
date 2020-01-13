import Card from "../Card";
import Player from "../../server/Player";
import Util from "../../Util";

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
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 1;
        let revealedCard: Card | undefined;
        const revealedCards: Card[] = [];
        while ((revealedCard = await player.deck.pop()) != null) {
            const kept = await player.reveal([revealedCard]);
            revealedCards.push(...kept);
            if (revealedCard.types.includes("treasure")) {
                break;
            }
        }
        if (revealedCards.length) {
            player.lm('%p reveals %s.', Util.formatCardList(revealedCards.map((a) => a.name)));
            await player.discard(revealedCard ? revealedCards.slice(0, -1) : revealedCards);
        }
        if (revealedCard) {
            player.lm('%p plays the revealed %s.', revealedCard.name);
            player.data.playArea.push(revealedCard);
            await player.playTreasure(revealedCard);
        }
    }
}
