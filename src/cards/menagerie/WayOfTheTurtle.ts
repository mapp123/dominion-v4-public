import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";

export default class WayOfTheTurtle extends Way {
    cardArt = "/img/card-img/Way_of_the_TurtleArt.jpg";
    cardText = "Set this aside. If you did, play it at the start of your next turn.";
    name = "way of the turtle";
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        if (tracker.hasTrack) {
            const card = tracker.exercise()!;
            player.lm('%p sets aside %l.', [card]);
            const holder = player.game.getCardHolder(player);
            holder.addCard(card);
            player.effects.setupEffect('turnStart', `${this.name} (${card.name})`, {
                // This is assumed to never be compatible
                compatibility: {}
            }, async (unsub) => {
                unsub();
                if (!holder.isEmpty) {
                    const c = holder.popCard()!;
                    player.data.playArea.push(c);
                    await player.playCard(c, null);
                }
            });
        }
    }
}