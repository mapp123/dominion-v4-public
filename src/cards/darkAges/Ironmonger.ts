import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Ironmonger extends Card {
    static descriptionSize = 49;
    intrinsicTypes = ["action"] as const;
    name = "ironmonger";
    cost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Reveal the top card of your deck; you may discard it. Either way, if it is an...\n" +
        "Action card, +1 Action\n" +
        "Treasure card, +$1\n" +
        "Victory card, +1 Card";
    supplyCount = 10;
    cardArt = "/img/card-img/IronmongerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        let card = await player.deck.pop();
        if (card) {
            card = (await player.reveal([card]))[0];
        }
        if (card) {
            if (await player.confirmAction(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', card.name))) {
                await player.discard(card);
            }
            else {
                player.deck.cards.unshift(card);
            }
            if (card.types.includes("action")) {
                player.data.actions++;
            }
            if (card.types.includes("treasure")) {
                player.data.money++;
            }
            if (card.types.includes("victory")) {
                await player.draw();
            }
        }
    }
}
