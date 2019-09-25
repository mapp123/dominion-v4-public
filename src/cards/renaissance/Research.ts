import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Research extends Card {
    intrinsicTypes = ["action","duration"] as const;
    name = "research";
    cost = {
        coin: 4
    };
    cardText = "+1 Action\n" +
        "Trash a card from your hand. Per $1 it costs, set aside a card from your deck face down (on this). At the start of your next turn, put those cards into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/ResearchArt.jpg";
    cards = this.game && this.game.getCardHolder();
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('research'));
        if (card) {
            await player.trash(card);
            let cost = player.game.getCostOfCard(card.name).coin;
            for (let i = 0; i < cost; i++) {
                const card = await player.deck.pop();
                if (card === undefined) break;
                this.cards.addCard(card);
            }
        }
        player.events.on('turnStart', async () => {
            const card = await player.chooseCard(Texts.chooseCardToTakeFromSetAside, this.cards.getCards(), false);
            if (card) {
                player.lm('%p takes %ac from the set aside cards for research.', Util.formatCardList([card.name]));
                player.data.hand.push(card);
                this.cards.removeCard(card);
                if (this.cards.getCards().length !== 0) {
                    return true;
                }
            }
            return false;
        });
    }
    shouldDiscardFromPlay(): boolean {
        return this.cards.getCards().length === 0;
    }
}
