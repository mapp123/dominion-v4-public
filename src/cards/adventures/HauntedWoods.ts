import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import CardRegistry from "../CardRegistry";
import type {EffectFun} from "../../server/PlayerEffects";

export default class HauntedWoods extends Card {
    static typelineSize = 43;
    intrinsicTypes = ["action","attack","duration"] as const;
    name = "haunted woods";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Until your next turn, when any other player buys a card, they put their hand onto their deck in any order.\n" +
        "At the start of your next turn: +3 Cards";
    supplyCount = 10;
    cardArt = "/img/card-img/HauntedWoodsArt.jpg";
    private isSecondTurn = false;
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        this.isSecondTurn = false;
        const cbs: Array<[Player, EffectFun<'buy', any>]> = [];
        await player.attackOthers(exemptPlayers, async (p) => {
            const cb = p.effects.setupEffect<'buy'>('buy', 'haunted woods', {
                compatibility: {
                    goons: true,
                    hoard: true,
                    mint: true,
                    talisman: true
                },
                temporalRelevance: () => p.data.hand.length > 0
            }, async (remove, purchase) => {
                if (CardRegistry.getInstance().getCard(purchase).isCard && p.data.hand.length > 0) {
                    const order = await p.chooseOrder(Texts.chooseOrderOfCards, p.data.hand, 'Top of Deck', 'Rest of Deck');
                    p.deck.cards = [...order, ...p.deck.cards];
                    p.data.hand = [];
                }
            });
            cbs.push([p, cb]);
        });
        player.effects.setupEffect('turnStart', 'haunted woods', {
            compatibility: {}
        }, async (remove) => {
            this.isSecondTurn = true;
            cbs.forEach(([p, cb]) => {
                p.effects.removeEffect('buy', 'haunted woods', cb);
            });
            await player.draw(3, true);
            remove();
        });
    }
    shouldDiscardFromPlay(): boolean {
        return this.isSecondTurn;
    }
}
