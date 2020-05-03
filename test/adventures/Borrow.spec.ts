import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('BORROW', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['borrow'],
            d
        });
        player.testBuy('borrow');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
