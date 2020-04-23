import Card from "../Card";
import type Player from "../../server/Player";
import type Tracker from "../../server/Tracker";

export default class Fortress extends Card {
    intrinsicTypes = ["action"] as const;
    name = "fortress";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "---" +
        "When you trash this, put it into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-FortressArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 2;
    }
    onTrashSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {
        if (tracker.hasTrack) {
            const me = tracker.exercise();
            if (me) {
                player.lm('The fortress returns to %p\'s hand.');
                player.data.hand.push(me);
            }
        }
    }
}
