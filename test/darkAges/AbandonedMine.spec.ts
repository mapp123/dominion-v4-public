import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ABANDONED MINE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['abandoned mine']],
            d
        });
        player.testPlayAction('abandoned mine');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'abandoned mine']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'abandoned mine');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
});
