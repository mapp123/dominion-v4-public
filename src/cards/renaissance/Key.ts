import Player from "../../server/Player";
import Artifact from "../Artifact";

export default class Key extends Artifact {
    static descriptionSize = 20;
    cardArt = "/img/card-img/KeyArt.jpg";
    cardText = "At the start of your turn, $1";
    name = "key";
    protected setup() {}
    private cb: any = null;
    private lastPlayer: Player | null = null;
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the key.');
        if (this.cb && this.lastPlayer) {
            this.lastPlayer.events.off('turnStart', this.cb);
        }
        this.cb = player.events.on('turnStart', async () => {
            player.data.money++;
            return true;
        });
        this.lastPlayer = player;
    }
}