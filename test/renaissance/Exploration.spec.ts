import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('EXPLORATION', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'gold']],
            activateCards: ['exploration'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('exploration');
        player.testPlayTreasure('gold');
        player.testBuy('silver');
        player.endTurn();
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(2);
            expect(player.data.villagers).to.equal(2);
            done();
        });
        game.start();
    });
});
