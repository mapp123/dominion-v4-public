import type Player from "../../server/Player";
import Artifact from "../Artifact";

export default class Horn extends Artifact {
    cardArt = "/img/card-img/HornArt.jpg";
    cardText = "Once per turn, when you discard a Border Guard from play, you may put it onto your deck.\n";
    name = "horn";
    lastUsedOn = -1;
    protected setup() {}
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the horn.');
        this.lastUsedOn = -1;
    }
}