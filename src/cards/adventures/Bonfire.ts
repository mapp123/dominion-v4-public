import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";

export default class Bonfire extends Event {
    cardArt = "/img/card-img/800px-BonfireArt.jpg";
    cardText = "Trash up to 2 cards you have in play.";
    intrinsicCost = {
        coin: 3
    };
    name = "bonfire";
    async onPurchase(player: Player): Promise<any> {
        let cardsTrashed = 0;
        while (cardsTrashed < 2) {
            const card = await player.chooseCard(Texts.chooseCardToTrashFor(this.name), player.data.playArea, true);
            if (!card) {
                break;
            }
            player.data.playArea.splice(player.data.playArea.indexOf(card), 1);
            await player.trash(card);
            cardsTrashed++;
        }
    }
}