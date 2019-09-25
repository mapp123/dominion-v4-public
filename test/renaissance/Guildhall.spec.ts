import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('GUILDHALL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper']],
            activateCards: ['guildhall'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('guildhall');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(1);
            done();
        });
        game.start();
    });
});
