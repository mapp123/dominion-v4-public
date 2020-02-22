import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('AMULET', () => {
    it('works +1 money', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['amulet']],
            d
        });
        player.testPlayAction('amulet');
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
        });
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            done();
        })
        game.start();
    });
    it('works trash card', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['amulet', 'copper', 'copper']],
            d
        });
        player.testPlayAction('amulet');
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.trashA('card from your hand'));
        player.testChooseCard(Texts.chooseCardToTrashFor('amulet'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper']);
        });
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.trashA('card from your hand'));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            done();
        })
        game.start();
    });
    it('works gain silver', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['amulet']],
            d
        });
        player.testPlayAction('amulet');
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.gain(['silver']));
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver']);
        });
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.gain(['silver']));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver']);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        })
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'amulet']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'amulet');
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
        });
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.hand.length).to.equal(0);
            done();
        });
        game.start();
    })
});
