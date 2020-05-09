import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Catacombs extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action"] as const;
    name = "catacombs";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Look at the top 3 cards of your deck. Choose one: Put them into your hand; or discard them and +3 Cards.\n" +
        "---" +
        "When you trash this, gain a cheaper card.";
    supplyCount = 10;
    cardArt = "/img/card-img/CatacombsArt.jpg";
    async onPlay(player: Player): Promise<void> {
        const top3 = [await player.deck.pop(), await player.deck.pop(), await player.deck.pop()].filter((a) => a != null) as Card[];
        player.lm('%p reveals %s.', Util.formatCardList(top3.map((a) => a.name)));
        if (await player.chooseOption(Texts.whatToDoWithCards(Util.formatCardList(top3.map((a) => a.name))), [Texts.keepThem, Texts.discardThemForBenefit('+3 Cards')]) === Texts.keepThem) {
            player.lm('%p keeps them.');
            player.data.hand.push(...top3);
        }
        else {
            player.lm('%p discards them.');
            await player.discard(top3);
            await player.draw(3, true);
        }
    }
    async onTrashSelf(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('catacombs'), false, GainRestrictions.instance().setLessThanCost(this.cost));
    }
}
