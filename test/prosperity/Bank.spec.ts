import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('BANK', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'silver', 'bank']],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('bank');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(6);
            done();
        });
        game.start();
    });
});
