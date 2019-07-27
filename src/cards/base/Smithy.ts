import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Smithy extends Card {
    types = ["action"] as const;
    name = "smithy";
    cost = {
        coin: 4
    };
    cardText = "+3 Cards";
    supplyCount = 10;
    cardArt = "/img/card-img/SmithyArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.draw(3);
    }
}
