import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SQUIRE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['squire']],
            d
        });
        player.testPlayAction('squire');
        player.testOption(Texts.chooseBenefitFor('squire'), Texts.extraActions("2"));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('reacts to trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['squire', 'chapel']],
            d,
            activateCards: ['militia']
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'squire');
        player.testGain('squire', 'militia');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['militia']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'squire']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'squire');
        player.testOption(Texts.chooseBenefitFor('squire'), Texts.gain(['silver']));
        player.testOption(Texts.chooseBenefitFor('squire'), Texts.extraBuys("2"));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(3);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    })
});
