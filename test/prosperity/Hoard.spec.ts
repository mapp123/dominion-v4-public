import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('HOARD', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hoard']],
            d
        });
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testPlayTreasure('hoard');
        player.testBuy('estate');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['estate', 'gold']);
            done();
        });
        game.start();
    });
});
