import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('QUARRY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['quarry']],
            d
        });
        game.injectTestAttack();
        player.testPlayTreasure('quarry');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(game.getCostOfCard('attack')).to.deep.equal({
                coin: 3
            });
            expect(game.getCostOfCard('estate')).to.deep.equal({
                coin: 2
            });
            done();
        });
        game.start();
    });
});
