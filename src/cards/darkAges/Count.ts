import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Count extends Card {
    intrinsicTypes = ["action"] as const;
    name = "count";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Choose one: Discard 2 cards; or put a card from your hand onto your deck; or gain a Copper.\n" +
        "Choose one: +$3; or trash your hand; or gain a Duchy.";
    supplyCount = 10;
    cardArt = "/img/card-img/CountArt.jpg";
    async onAction(player: Player): Promise<void> {
        switch (await player.chooseOption(Texts.chooseBenefitFor('count'), [Texts.discardXCards("2"), Texts.putACardFromYourHandOnTopOfYourDeck, Texts.gain(['copper'])] as const)) {
            case Texts.discardXCards("2"):
                let card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('count'));
                if (card) {
                    await player.discard(card);
                }
                card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('count'));
                if (card) {
                    await player.discard(card);
                }
                break;
            case Texts.putACardFromYourHandOnTopOfYourDeck:
                const cardToTopdeck = await player.chooseCardFromHand(Texts.chooseCardToPutOnDeck);
                if (cardToTopdeck) {
                    player.deck.cards = [cardToTopdeck, ...player.deck.cards];
                }
                break;
            case Texts.gain(['copper']):
                await player.gain('copper');
                break;
        }
        switch (await player.chooseOption(Texts.chooseBenefitFor('count'), [Texts.extraMoney("3"), Texts.trashYourHand, Texts.gain(['duchy'])])) {
            case Texts.extraMoney("3"):
                player.data.money += 3;
                break;
            case Texts.trashYourHand:
                const cards = [...player.data.hand];
                player.data.hand = [];
                player.lm('%p trashes %s.', Util.formatCardList(cards.map((a) => a.name)));
                for (const card of cards) {
                    await player.trash(card, false);
                }
                break;
            case Texts.gain(['duchy']):
                await player.gain('duchy');
                break;
        }
    }
}
