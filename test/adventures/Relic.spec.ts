import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('RELIC', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['relic'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayTreasure('relic');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
        });
        q.endTurn();
        player.onBuyPhaseStart(() => {
            expect(q.data.hand.length).to.equal(4);
            done();
        });
        game.start();
    });
});
