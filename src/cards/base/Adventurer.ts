import Card from "../Card";
import Player from "../../server/Player";
import Util from "../../Util";

export default class Adventurer extends Card {
    types = ["action"] as const;
    name = "adventurer";
    cost = {
        coin: 6
    };
    cardText = "Reveal cards from your deck until you reveal 2 Treasure cards. Put those Treasure cards into your hand and discard the other revealed cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/AdventurerArt.jpg";
    async onAction(player: Player): Promise<void> {
        let revealed: Card[] = [];
        let revealedCard: Card | undefined;
        while (revealed.filter((a) => a.types.includes("treasure")).length < 2 && (revealedCard = await player.deck.pop()) != null) {
            player.lm('%p reveals %s.', Util.formatCardList([revealedCard.name]));
            const kept = await player.reveal([revealedCard]);
            revealed.push(...kept);
        }
        player.lm('%p puts the revealed treasures into their hand, and discards the rest.');
        player.data.hand.push(...revealed.filter((a) => a.types.includes("treasure")));
        await player.discard(revealed.filter((a) => !a.types.includes("treasure")));
    }
}
