import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheSheep extends Way {
    cardArt = "/img/card-img/Way_of_the_SheepArt.jpg";
    cardText = "+$2";
    name = "way of the sheep";
    async onWay(player: Player): Promise<void> {
        await player.addMoney(2);
    }
}