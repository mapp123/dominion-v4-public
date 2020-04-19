import Player from "../../server/Player";
import Artifact from "../Artifact";

export default class Key extends Artifact {
    static descriptionSize = 29;
    cardArt = "/img/card-img/KeyArt.jpg";
    cardText = "At the start of your turn, +$1";
    name = "key";
    protected setup() {}
    private cb: any = null;
    private lastPlayer: Player | null = null;
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the key.');
        if (this.cb && this.lastPlayer) {
            this.lastPlayer.effects.removeEffect('turnStart', 'key', this.cb);
        }
        this.cb = player.effects.setupEffect('turnStart', 'key', {
            compatibility: () => true
        }, async () => {
            player.data.money++;
        });
        this.lastPlayer = player;
    }
}