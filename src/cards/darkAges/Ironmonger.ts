import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Ironmonger extends Card {
    static descriptionSize = 49;
    intrinsicTypes = ["action"] as const;
    name = "ironmonger";
    intrinsicCost = {
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
    async onPlay(player: Player): Promise<void> {
        await player.draw(1, true);
        player.data.actions++;
        const card = (await player.revealTop(1, true))[0];
        if (card) {
            if (await player.confirmAction(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', card.viewCard().name))) {
                if (card.hasTrack) {
                    await player.discard(card.exercise()!);
                }
            }
            else {
                if (card.hasTrack) {
                    player.deck.cards.unshift(card.exercise()!);
                }
            }
            if (card.viewCard().types.includes("action")) {
                player.data.actions++;
            }
            if (card.viewCard().types.includes("treasure")) {
                player.data.money++;
            }
            if (card.viewCard().types.includes("victory")) {
                await player.draw(1, true);
            }
        }
    }
}
