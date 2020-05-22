import type Player from "../../server/Player";
import Event from "../Event";

export default class Borrow extends Event {
    static descriptionSize = 29;
    cardArt = "/img/card-img/BorrowArt.jpg";
    cardText = "Once per turn: +1 Buy. If your –1 Card token isn't on your deck, put it there and +$1.";
    intrinsicCost = {
        coin: 0
    };
    name = "borrow";
    tokens = ["minusOneCard"] as const;
    static oncePerTurn = true
    async onPurchase(player: Player): Promise<any> {
        player.data.buys += 1;
        if (player.data.tokens.minusOneCard === false) {
            player.data.tokens.minusOneCard = true;
            await player.addMoney(1);
        }
    }
}