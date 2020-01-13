import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Survivors extends Card {
    intrinsicTypes = ["action","ruins"] as const;
    name = "survivors";
    intrinsicCost = {
        coin: 0
    };
    cardText = "Look at the top 2 cards of your deck. Discard them or put them back in any order.";
    supplyCount = 10;
    cardArt = "/img/card-img/SurvivorsArt.jpg";
    randomizable = false;
    async onAction(player: Player): Promise<void> {
        let cards = [await player.deck.pop(), await player.deck.pop()].filter(Util.nonNull);
        cards = await player.reveal(cards);
        const choice = await player.chooseOption(Texts.whatToDoWithCards(Util.formatCardList(cards.map((a) => a.name))), [Texts.discardThem, Texts.putThemOnYourDeck] as const);
        switch (choice) {
            case Texts.discardThem:
                await player.discard(cards);
                break;
            case Texts.putThemOnYourDeck:
                cards = await player.chooseOrder(Texts.chooseOrderOfCards, cards, 'Top of Deck', 'Bottom of Deck');
                player.deck.cards.unshift(...cards);
                break;
        }
    }
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
}
