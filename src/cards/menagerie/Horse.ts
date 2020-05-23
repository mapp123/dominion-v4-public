import Card from "../Card";
import type Player from "../../server/Player";

export default class Horse extends Card {
    intrinsicTypes = ["action"] as const;
    name = "horse";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+2 Cards\n" +
        "+1 Action\n" +
        "Return this to its pile.\n" +
        "(This is not in the Supply.)";
    supplyCount = 30;
    cardArt = "/img/card-img/HorseArt.jpg";
    static inSupply = false;
    randomizable = false;
    async onPlay(player: Player, ep, tracker): Promise<void> {
        await player.draw(2, true);
        player.data.actions += 1;
        if (tracker.hasTrack) {
            tracker.exercise();
            this.returnToPile(player);
        }
    }
}
