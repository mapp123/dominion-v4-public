import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('PIAZZA', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'attack'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            activateCards: ['piazza'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('piazza');
        q.endTurn();
        player.onBuyPhaseStart(() => {
            // Draw attack should have fired.
            expect(q.hand.length).to.equal(6);
            done();
        });
        game.start();
    });
});
