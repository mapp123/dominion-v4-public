import type Player from "../../server/Player";
import Way from "../Way";

export default class WayOfTheOwl extends Way {
    cardArt = "/img/card-img/Way_of_the_OwlArt.jpg";
    cardText = "Draw until you have 6 cards in hand.";
    name = "way of the owl";
    async onWay(player: Player): Promise<void> {
        while (player.data.hand.length < 6) {
            const oldLen = player.data.hand.length;
            await player.draw(1, false);
            const newLen = player.data.hand.length;
            if (oldLen === newLen) {
                player.lm('%p has no more cards to draw!');
                break;
            }
        }
    }
}