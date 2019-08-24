import Player from "../../server/Player";
import Artifact from "../Artifact";

export default class Flag extends Artifact {
    cardArt = "/img/card-img/FlagArt.jpg";
    cardText = "When drawing your hand, +1 Card.";
    name = "flag";
    protected setup() {}
    private cb: any = null;
    private lastPlayer: Player | null = null;
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the flag.');
        if (this.cb && this.lastPlayer) {
            this.lastPlayer.events.off('handDraw', this.cb);
        }
        this.cb = player.events.on('handDraw', async () => {
            player.lm('The flag activates for %p.');
            await player.draw(1);
            return true;
        });
        this.lastPlayer = player;
    }
}