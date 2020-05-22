import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheSquirrel extends Way {
    cardArt = "/img/card-img/Way_of_the_SquirrelArt.jpg";
    cardText = "+2 Cards at the end of this turn.";
    name = "way of the squirrel";
    async onWay(player: Player): Promise<void> {
        // Why? Because with Black Cat, you can play this when it isn't your turn.
        player.game.currentPlayer.effects.setupEffect('handDraw', this.name, {
            compatibility: {
                expedition: true,
                flag: true
            }
        }, async (unsub) => {
            await player.draw(2, true);
            unsub();
        });
    }
}