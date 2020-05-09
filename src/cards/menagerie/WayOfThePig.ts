import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfThePig extends Way {
    cardArt = "/img/card-img/Way_of_the_PigArt.jpg";
    cardText = "+1 Card\n+1 Action";
    intrinsicCost = {
        coin: 0
    };
    name = "way of the pig";
    async onWay(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
    }
}