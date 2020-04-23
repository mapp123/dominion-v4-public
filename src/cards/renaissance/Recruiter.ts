import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Recruiter extends Card {
    intrinsicTypes = ["action"] as const;
    name = "recruiter";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Trash a card from your hand.\n" +
        "+1 Villager\n" +
        "per $1 it costs.";
    features = ["villagers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/RecruiterArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(2);
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('recruiter'));
        if (card) {
            await player.trash(card);
            player.data.villagers += player.game.getCostOfCard(card.name).coin;
        }
    }
}
