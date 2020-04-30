import Card from "../Card";
import type Player from "../../server/Player";

export default class SwampHag extends Card {
    intrinsicTypes = ["action","attack","duration"] as const;
    name = "swamp hag";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Until your next turn, when any other player buys a card, they gain a Curse.\n" +
        "At the start of your next turn: +$3";
    supplyCount = 10;
    cardArt = "/img/card-img/Swamp_HagArt.jpg";
    private isSecondTurn = false;
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        this.isSecondTurn = false;
        const cbs: Array<[Player, any]> = [];
        await player.attackOthers(exemptPlayers, async (p) => {
            const cb = p.effects.setupEffect('buy', this.name, {
                compatibility: {
                    'haunted woods': true,
                    hovel: true,
                    hoard: true,
                    mint: true
                }
            }, async (remove, cardName) => {
                if (p.game.getCard(cardName).isCard) {
                    p.lm('%p gains a curse from swamp hag.');
                    await p.gain('curse', undefined, false);
                }
            });
            cbs.push([p, cb]);
        });
        await player.effects.setupEffect('turnStart', this.name, {
            compatibility: () => true
        }, async (remove) => {
            this.isSecondTurn = true;
            cbs.forEach(([p, cb]) => {
                p.effects.removeEffect('buy', this.name, cb);
            });
            player.data.money += 3;
            remove();
        });
    }
    shouldDiscardFromPlay(): boolean {
        return this.isSecondTurn;
    }
}
