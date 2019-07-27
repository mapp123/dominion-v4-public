import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Poacher extends Card {
    types = ["action"] as const;
    name = "poacher";
    cost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+$1\n" +
        "Discard a card per empty supply pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/PoacherArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        player.data.money += 1;
        let empty = player.game.supply.pilesEmpty;
        for (let i = 0; i < empty; i++) {
            const card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('poacher'));
            if (card) {
                player.lm('%p discards a %s.', card.name);
                await player.discard(card);
            }
        }
    }
}
