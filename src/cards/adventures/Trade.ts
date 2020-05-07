import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";

export default class Trade extends Event {
    cardArt = "/img/card-img/800px-TradeArt.jpg";
    cardText = "Trash up to 2 cards from your hand.\n" +
        "Gain a Silver per card you trashed.";
    intrinsicCost = {
        coin: 5
    };
    name = "trade";
    async onPurchase(player: Player): Promise<any> {
        for (let i = 0; i < 2; i++) {
            const card = await player.chooseCardFromHand(Texts.trashForBenefit(Texts.gain(['silver']), 1), true);
            if (card) {
                await player.trash(card);
                await player.gain('silver');
            }
            else {
                break;
            }
        }
    }
}