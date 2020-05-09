import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Dungeon extends Card {
    static typelineSize = 63;
    intrinsicTypes = ["action","duration"] as const;
    name = "dungeon";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "Now and at the start of your next turn: +2 Cards, then discard 2 cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-DungeonArt.jpg";
    private isNextTurn = false;
    async doEffect(player: Player) {
        await player.draw(2, true);
        let card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('dungeon'));
        if (card) {
            await player.discard(card);
            card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('dungeon'));
            if (card) {
                await player.discard(card);
            }
        }
    }

    shouldDiscardFromPlay(): boolean {
        return this.isNextTurn;
    }

    async onPlay(player: Player): Promise<void> {
        player.data.actions++;
        await this.doEffect(player);
        player.effects.setupEffect('turnStart', 'dungeon', {
            compatibility: {}
        }, async (unsub) => {
            this.isNextTurn = true;
            await this.doEffect(player);
            unsub();
        });
        this.isNextTurn = false;
    }
}
