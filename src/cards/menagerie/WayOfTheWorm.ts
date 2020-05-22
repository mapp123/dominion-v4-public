import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheWorm extends Way {
    features = ["exile"] as const;
    cardArt = "/img/card-img/Way_of_the_WormArt.jpg";
    cardText = "Exile an Estate from the Supply.";
    name = "way of the worm";
    async onWay(player: Player): Promise<void> {
        const card = await player.game.grabNameFromSupply('estate');
        if (card) {
            player.lm('%p exiles an estate from the supply.');
            player.data.exile.push(card);
        }
    }
}