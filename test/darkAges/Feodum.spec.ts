import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('FEODUM', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['feodum', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(1);
            done();
        });
        game.start();
    });
});
