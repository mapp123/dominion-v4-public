import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SLEIGH', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sleigh']],
            d
        });
        player.testPlayAction('sleigh');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['sleigh', 'horse', 'horse']);
            done();
        });
        game.start();
    });
    it('reacts to gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sleigh', 'sleigh']],
            d
        });
        player.testPlayAction('sleigh');
        player.testConfirm(Texts.wantToDiscardAForBenefit('sleigh', 'move the gained horse'), true);
        player.testOption(Texts.whatToDoWith('horse'), Texts.putItInYourHand);
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['sleigh', 'sleigh', 'horse', 'horse']);
            expect(player.hand).to.have.members(['horse']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'sleigh']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'sleigh');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['throne room', 'sleigh', 'horse', 'horse', 'horse', 'horse']);
            done();
        });
        game.start();
    })
});
