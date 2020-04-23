import Card from "../Card";
import type Player from "../../server/Player";
import Util from "../../Util";
import type Tracker from "../../server/Tracker";

export default class Adventurer extends Card {
    intrinsicTypes = ["action"] as const;
    name = "adventurer";
    intrinsicCost = {
        coin: 6
    };
    cardText = "Reveal cards from your deck until you reveal 2 Treasure cards. Put those Treasure cards into your hand and discard the other revealed cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/AdventurerArt.jpg";
    async onAction(player: Player): Promise<void> {
        const revealed: Array<Tracker<Card>> = [];
        while (revealed.filter((a) => a.viewCard().types.includes("treasure")).length < 2) {
            const revealedCard = await player.revealTop(1);
            revealed.push(...revealedCard);
        }
        player.lm('%p reveals %s.', Util.formatCardList(revealed.map((a) => a.viewCard().name)));
        player.lm('%p puts the revealed treasures into their hand, and discards the rest.');
        player.data.hand.push(...Util.filterAndExerciseTrackers(revealed.filter((a) => a.viewCard().types.includes("treasure"))));
        await player.discard(Util.filterAndExerciseTrackers(revealed));
    }
}
