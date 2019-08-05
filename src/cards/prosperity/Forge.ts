import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Forge extends Card {
    types = ["action"] as const;
    name = "forge";
    cost = {
        coin: 7
    };
    cardText = "Trash any number of cards from your hand. Gain a card with cost exactly equal to the total cost in $ of the trashed cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/ForgeArt.jpg";
    async onAction(player: Player): Promise<void> {
        let card: Card | null;
        let money = 0;
        while ((card = await player.chooseCardFromHand(Texts.chooseCardToTrashForge(money), true)) != null) {
            await player.trash(card);
            money += player.game.getCostOfCard(card.name).coin;
        }
        const gainedCard = await player.chooseGain(Texts.chooseCardToGainFor('forge'), false, GainRestrictions.instance().setExactCoinCost(money));
        if (gainedCard == null) {
            player.lm('There are no cards costing exactly %s for %p to gain.', money);
        }
    }
}
