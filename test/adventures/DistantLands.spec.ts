import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DISTANT LANDS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['distant lands']],
            d
        });
        player.testPlayAction('distant lands');
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(4);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'distant lands']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'distant lands');
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(4);
            done();
        });
        game.start();
    })
});
