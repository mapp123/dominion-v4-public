import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('SPICES', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['spices']],
            d
        });
        player.testPlayTreasure('spices');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('adds coffers on gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold'], ['spices']],
            d
        });
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('spices');
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(2);
            done();
        });
        game.start();
    })
});
