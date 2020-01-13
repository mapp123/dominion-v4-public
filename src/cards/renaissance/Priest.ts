import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Priest extends Card {
    intrinsicTypes = ["action"] as const;
    name = "priest";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "Trash a card from your hand. For the rest of this turn, when you trash a card, +$2.";
    supplyCount = 10;
    cardArt = "/img/card-img/PriestArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('priest'));
        if (card) {
            await player.trash(card);
        }
        const unsub = player.events.on('trash', () => {
            player.data.money += 2;
            return true;
        });
        player.events.on('turnEnd', () => {
            player.events.off('trash', unsub);
            return false;
        });
    }
}
