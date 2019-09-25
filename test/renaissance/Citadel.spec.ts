import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('CITADEL', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['gold', 'gold', 'silver', 'copper', 'copper', 'attack'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            activateCards: ['citadel'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('citadel');
        q.endTurn();
        player.testPlayAction('attack');
        player.onBuyPhaseStart(() => {
            expect(q.hand.length).to.equal(7);
            done();
        });
        game.start();
    });
});
