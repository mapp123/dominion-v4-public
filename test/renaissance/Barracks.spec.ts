import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('BARRACKS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'silver', 'copper', 'copper']],
            activateCards: ['barracks'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('barracks');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
});
