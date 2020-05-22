import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheOtter extends Way {
    cardArt = "/img/card-img/Way_of_the_OtterArt.jpg";
    cardText = "+2 Cards";
    name = "way of the otter";
    async onWay(player: Player): Promise<void> {
        await player.draw(2, true);
    }
}