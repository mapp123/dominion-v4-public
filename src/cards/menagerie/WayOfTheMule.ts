import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheMule extends Way {
    cardArt = "/img/card-img/Way_of_the_MuleArt.jpg";
    cardText = "+1 Action\n" +
        "+$1";
    name = "way of the mule";
    async onWay(player: Player): Promise<void> {
        player.data.actions++;
        await player.addMoney(1);
    }
}