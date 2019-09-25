import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('ACADEMY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper']],
            activateCards: ['academy', 'village'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('academy');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('village');
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.villagers).to.equal(1);
            done();
        });
        game.start();
    });
});
