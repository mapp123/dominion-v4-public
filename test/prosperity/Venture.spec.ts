import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('VENTURE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['venture', 'copper', 'copper', 'copper', 'copper', 'estate', 'attack', 'silver']],
            d
        });
        player.testPlayTreasure('venture');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['estate', 'attack']);
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
});
