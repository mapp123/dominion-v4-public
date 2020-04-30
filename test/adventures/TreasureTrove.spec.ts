import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('TREASURE TROVE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['treasure trove']],
            d
        });
        player.testPlayTreasure('treasure trove');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.discardPile).to.have.members(['gold', 'copper']);
            done();
        });
        game.start();
    });
});
