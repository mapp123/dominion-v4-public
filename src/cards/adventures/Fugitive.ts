import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Traveller from "./Traveller.abstract";

export default class Fugitive extends Traveller {
    static typelineSize = 63;
    static descriptionSize = 50;
    intrinsicTypes = ["action","traveller"] as const;
    name = "fugitive";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+2 Cards\n" +
        "+1 Action\n" +
        "Discard a card.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Disciple.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/FugitiveArt.jpg";
    travellerTarget = "disciple";
    randomizable = false;
    static inSupply = false;
    async onPlay(player: Player): Promise<void> {
        await player.draw(2);
        player.data.actions++;
        const card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('fugitive'));
        if (card) {
            await player.discard(card);
        }
    }
}
