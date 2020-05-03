import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WINE MERCHANT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['wine merchant']],
            d
        });
        player.testPlayAction('wine merchant');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.data.buys).to.equal(2);
            expect(player.data.tavernMat.length).to.equal(1);
        });
        player.testConfirm(Texts.doYouWantToRemoveFromTavernMat('wine merchant'), true);
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['wine merchant']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'wine merchant']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'wine merchant');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(8);
            expect(player.data.buys).to.equal(3);
            expect(player.data.tavernMat.length).to.equal(1);
        });
        player.testConfirm(Texts.doYouWantToRemoveFromTavernMat('wine merchant'), true);
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['wine merchant', 'throne room']);
            done();
        });
        game.start();
    })
});
