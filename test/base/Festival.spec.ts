import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FESTIVAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['festival']],
            d
        });
        player.testPlayAction('festival');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(2);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'festival']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'festival');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.data.buys).to.equal(3);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
