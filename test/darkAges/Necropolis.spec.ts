import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('NECROPOLIS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['necropolis']],
            d
        });
        player.testPlayAction('necropolis');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'necropolis']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'necropolis');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
