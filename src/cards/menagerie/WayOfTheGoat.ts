import type Player from "../../server/Player";
import Way from "../Way";
import {Texts} from "../../server/Texts";

export default class WayOfTheGoat extends Way {
    cardArt = "/img/card-img/Way_of_the_GoatArt.jpg";
    cardText = "Trash a card from your hand.";
    name = "way of the goat";
    async onWay(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor(this.name));
        if (card) {
            await player.trash(card);
        }
    }
}