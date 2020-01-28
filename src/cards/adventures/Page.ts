import Player from "../../server/Player";
import Traveller from "./Traveller.abstract";

export default class Page extends Traveller {
    intrinsicTypes = ["action","traveller"] as const;
    name = "page";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Treasure Hunter.";
    supplyCount = 10;
    cardArt = "/img/card-img/PageArt.jpg";
    travellerTarget = "treasure hunter";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions++;
    }
}
