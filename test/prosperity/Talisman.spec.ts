import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('TALISMAN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['talisman', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayTreasure('talisman');
        player.testBuy('copper');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['talisman', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
