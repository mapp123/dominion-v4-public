import type Player from "../../server/Player";
import Artifact from "../Artifact";

export default class Lantern extends Artifact {
    cardArt = "/img/card-img/LanternArt.jpg";
    cardText = "Your Border Guards reveal 3 cards and discard 2. (It takes all 3 being Actions to take the Horn.)";
    name = "lantern";
    protected setup() {}
    protected giveToPlayer(player: Player) {
        player.lm('%p takes the lantern.');
    }
}