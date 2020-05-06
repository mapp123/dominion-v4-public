import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('RAID', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['gold', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['raid'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('raid');
        q.endTurn();
        player.onBuyPhaseStart(() => {
            expect(q.hand.length).to.equal(4);
            expect(player.allCardsTest).to.have.members(['gold', 'silver', 'silver']);
            done();
        });
        game.start();
    });
});
