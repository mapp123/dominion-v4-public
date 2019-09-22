import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('FAIR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper']],
            activateCards: ['fair'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('fair');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
});
