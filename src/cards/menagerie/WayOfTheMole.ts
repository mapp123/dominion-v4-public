import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheMole extends Way {
    cardArt = "/img/card-img/Way_of_the_MoleArt.jpg";
    cardText = "+1 Action\n" +
        "Discard your hand. +3 Cards.";
    name = "way of the mole";
    async onWay(player: Player): Promise<void> {
        player.data.actions++;
        const cards = [...player.data.hand];
        player.data.hand = [];
        player.lm('%p discards their hand.');
        await player.discard(cards);
        await player.draw(3, true);
    }
}