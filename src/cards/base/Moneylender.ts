import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Moneylender extends Card {
    intrinsicTypes = ["action"] as const;
    name = "moneylender";
    intrinsicCost = {
        coin: 4
    };
    cardText = "You may trash a Copper from your hand for +$3.";
    supplyCount = 10;
    cardArt = "/img/card-img/MoneylenderArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseAnAToTrashForB('copper', 'moneylender'), true, (card) => card.name === 'copper');
        if (card) {
            await player.trash(card);
            player.data.money += 3;
        }
    }
}
