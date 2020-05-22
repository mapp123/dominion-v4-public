import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheMonkey extends Way {
    cardArt = "/img/card-img/Way_of_the_MonkeyArt.jpg";
    cardText = "+1 Buy\n" +
        "+$1";
    name = "way of the monkey";
    async onWay(player: Player): Promise<void> {
        player.data.buys++;
        await player.addMoney(1);
    }
}