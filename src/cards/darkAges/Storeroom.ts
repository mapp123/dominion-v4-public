import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Storeroom extends Card {
    intrinsicTypes = ["action"] as const;
    name = "storeroom";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Buy\n" +
        "Discard any number of cards, then draw that many. Then discard any number of cards for +$1 each.";
    supplyCount = 10;
    cardArt = "/img/card-img/StoreroomArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.buys += 1;
        let card: Card | null;
        let cards = 0;
        while ((card = await player.chooseCardFromHand(Texts.discardForBenefit(Texts.drawXCards("1"), 1), true)) != null) {
            await player.discard(card);
            cards++;
        }
        await player.draw(cards);
        while ((card = await player.chooseCardFromHand(Texts.discardForBenefit(Texts.extraMoney("1"), 1), true)) != null) {
            await player.discard(card);
            player.data.money += 1;
        }
    }
}
