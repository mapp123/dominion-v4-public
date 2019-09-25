import Card from "../Card";
import Player from "../../server/Player";

export default class Smithy extends Card {
    intrinsicTypes = ["action"] as const;
    name = "smithy";
    cost = {
        coin: 4
    };
    cardText = "+3 Cards";
    supplyCount = 10;
    cardArt = "/img/card-img/SmithyArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(3);
    }
}
