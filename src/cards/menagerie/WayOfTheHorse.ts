import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";

export default class WayOfTheHorse extends Way {
    static nameSize = 29;
    cardArt = "/img/card-img/Way_of_the_HorseArt.jpg";
    cardText = "+2 Cards\n" +
        "+1 Action\n" +
        "Return this to its pile.";
    name = "way of the horse";
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        await player.draw(2, true);
        player.data.actions++;
        const pileId = tracker.viewCard().getPileIdentifier();
        if (tracker.hasTrack && pileId != null) {
            const pile = player.game.supply.getPile(pileId);
            if (pile != null) {
                pile.push(tracker.exercise()!);
                player.lm('%p returns %l to it\'s pile.', [tracker.viewCard()]);
            }
        }
    }
}