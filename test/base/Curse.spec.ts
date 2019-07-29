import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('CURSE', () => {
    it('scores', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['curse']],
            d
        });
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(-1);
            done();
        });
        game.start();
    });
});
