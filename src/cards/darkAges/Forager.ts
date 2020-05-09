import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Forager extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action"] as const;
    name = "forager";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "+1 Buy\n" +
        "Trash a card from your hand, then +$1 per differently named Treasure in the trash.";
    supplyCount = 10;
    cardArt = "/img/card-img/ForagerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.actions++;
        player.data.buys++;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('forager'));
        if (card) {
            await player.trash(card);
        }
        await player.addMoney(player.game.trash.filter((a, i) => player.game.trash.findIndex((b) => b.name === a.name) === i).filter((a) => a.types.includes('treasure')).length);
    }
}
