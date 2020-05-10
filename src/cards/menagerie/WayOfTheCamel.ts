import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheCamel extends Way {
    features = ["exile"] as const;
    cardArt = "/img/card-img/Way_of_the_CamelArt.jpg";
    cardText = "Exile a Gold from the Supply.";
    name = "way of the camel";
    async onWay(player: Player): Promise<void> {
        const card = player.game.grabNameFromSupply('gold');
        if (card) {
            player.lm('%p exiles a gold.');
            player.data.exile.push(card);
        }
        else {
            player.lm('There are no golds for %p to exile.');
        }
    }
}