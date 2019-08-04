import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MOUNTEBANK', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['mountebank'], []],
            d,
            players: 2
        });
        player.testPlayAction('mountebank');
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['curse', 'copper']);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with discarding a curse', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['mountebank'], ['curse']],
            d,
            players: 2
        });
        player.testPlayAction('mountebank');
        q.testConfirm(Texts.doYouWantToDiscardAnAForB('curse', 'mountebank'), true);
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['curse']);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'mountebank'], []],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mountebank');
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['curse', 'copper', 'curse', 'copper']);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
