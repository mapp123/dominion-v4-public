import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type CardHolder from "../../server/CardHolder";

export default class Gear extends Card {
    static typelineSize = 63;
    intrinsicTypes = ["action","duration"] as const;
    name = "gear";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+2 Cards\n" +
        "Set aside up to 2 cards from your hand face down (under this). At the start of your next turn, put them into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/GearArt.jpg";
    private setAside: CardHolder | null = null;
    async onPlay(player: Player): Promise<void> {
        await player.draw(2, true);
        let card = await player.chooseCardFromHand(Texts.chooseCardToSetAsideFor('gear'), true);
        if (card) {
            if (this.setAside == null) {
                this.setAside = this.game.getCardHolder(player);
            }
            this.setAside.addCard(card);
            card = await player.chooseCardFromHand(Texts.chooseCardToSetAsideFor('gear'), true);
            if (card) {
                this.setAside.addCard(card);
            }
        }
        if (this.setAside == null) {
            this.setAside = this.game.getCardHolder(player);
        }
        if (this.setAside.getCards().length > 0) {
            const cards = this.setAside.getCards();
            player.lm(`%p sets aside %hl.`, cards);
            player.effects.setupEffect('turnStart', 'gear', {
                compatibility: {}
            }, async (unsub) => {
                player.lm('%p takes the set aside cards.');
                while (this.setAside?.isEmpty === false) {
                    player.data.hand.push(this.setAside.popCard()!);
                }
                unsub();
            });
        }
    }
    shouldDiscardFromPlay(): boolean {
        return !!this.setAside?.isEmpty;
    }
}
