import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('INNOVATION', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'silver', 'copper', 'copper']],
            activateCards: ['innovation', 'militia'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('innovation');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testBuy('militia');
        player.testConfirm(Texts.wouldYouLikeToSetAsideThe('militia', 'innovation'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    });
});
