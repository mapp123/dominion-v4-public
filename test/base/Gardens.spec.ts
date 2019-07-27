import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GARDENS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gardens', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(1);
            done();
        });
        game.start();
    });
    it('rounds down', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gardens', ...new Array(25).fill('copper')]],
            d
        });
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(2);
            done();
        });
        game.start();
    });
});
