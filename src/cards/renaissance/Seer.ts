import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import Cost from "../../server/Cost";

export default class Seer extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action"] as const;
    name = "seer";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Reveal the top 3 cards of your deck. Put the ones costing from $2 to $4 into your hand. Put the rest back in any order.";
    supplyCount = 10;
    cardArt = "/img/card-img/SeerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        let revealed = await player.revealTop(3, true);
        const lowerLimit = Cost.create(2);
        const upperLimit = Cost.create(4);
        revealed = revealed.filter((a) => {
            if (a.viewCard().cost.isInRange(lowerLimit, upperLimit)) {
                player.lm('%p takes the %s.', a.viewCard().name);
                if (a.hasTrack) {
                    player.data.hand.push(a.exercise()!);
                }
                return false;
            }
            return true;
        });
        const cardOrder = await player.chooseOrder(Texts.chooseOrderOfCards, revealed.filter((a) => a.hasTrack).map((a) => a.viewCard()), 'Top of Deck', 'Bottom of Deck');
        player.lm('%p puts the rest back in any order.');
        player.deck.setCards([...Util.filterAndExerciseTrackers(cardOrder.map((a) => revealed.find((b) => b.viewCard().id === a.id)!)), ...player.deck.cards]);
    }
}
