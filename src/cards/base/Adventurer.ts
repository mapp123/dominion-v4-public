import Card from "../Card";
import Player from "../../server/Player";

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
        while (revealed.filter((a) => a.types.includes("treasure")).length < 2 && (revealedCard = player.deck.pop()) != null) {
            revealed.push(revealedCard);
            player.lm('%p reveals a %s.', revealedCard.name);
        }
        player.lm('%p puts the revealed treasures into their hand, and discards the rest.');
        player.data.hand.push(...revealed.filter((a) => a.types.includes("treasure")));
        await player.discard(revealed.filter((a) => !a.types.includes("treasure")));
    }
}
