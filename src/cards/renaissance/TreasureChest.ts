import Player from "../../server/Player";
import Artifact from "../Artifact";

export default class TreasureChest extends Artifact {
    cardArt = "/img/card-img/Treasure_ChestArt.jpg";
    cardText = "At the start of your Buy phase, gain a Gold.";
    name = "treasure chest";
    protected setup() {}
    private cb: any = null;
    private lastPlayer: Player | null = null;
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the treasure chest.');
        if (this.cb && this.lastPlayer) {
            this.lastPlayer.events.off('buyStart', this.cb);
        }
        this.cb = player.events.on('buyStart', async () => {
            player.lm('The treasure chest activates for %p.');
            await player.gain('gold');
            return true;
        });
        this.lastPlayer = player;
    }
}