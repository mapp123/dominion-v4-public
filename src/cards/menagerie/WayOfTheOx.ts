import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheOx extends Way {
    cardArt = "/img/card-img/Way_of_the_OxArt.jpg";
    cardText = "+2 Actions";
    name = "way of the ox";
    async onWay(player: Player): Promise<void> {
        player.data.actions += 2;
    }
}