import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('CANAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'silver', 'silver', 'copper', 'copper']],
            activateCards: ['canal'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('canal');
        player.testPlayTreasure('silver');
        player.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['gold', 'silver', 'silver', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
});
