import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCRAP', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['scrap', 'gold', 'estate']],
            d
        });
        player.testPlayAction('scrap');
        player.testChooseCard(Texts.chooseCardToTrashFor('scrap'), 'gold');
        player.testOption(Texts.chooseXBenefitsFor(6, 'scrap'), Texts.gain(['horse']));
        player.testOption(Texts.chooseXBenefitsFor(5, 'scrap'), Texts.plusOneCard);
        player.testOption(Texts.chooseXBenefitsFor(4, 'scrap'), Texts.plusOneMoney);
        player.testOption(Texts.chooseXBenefitsFor(3, 'scrap'), Texts.plusOneAction);
        player.testOption(Texts.chooseXBenefitsFor(2, 'scrap'), Texts.plusOneBuy);
        player.testOption(Texts.chooseXBenefitsFor(1, 'scrap'), Texts.gain(['silver']));
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'horse']);
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            expect(player.data.actions).to.equal(1);
            expect(player.allCardsTest).to.have.members(['scrap', 'horse', 'silver', 'estate']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'scrap', 'estate', 'estate', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'scrap');
        player.testChooseCard(Texts.chooseCardToTrashFor('scrap'), 'estate');
        player.testOption(Texts.chooseXBenefitsFor(2, 'scrap'), Texts.plusOneBuy);
        player.testOption(Texts.chooseXBenefitsFor(1, 'scrap'), Texts.plusOneMoney);
        player.testChooseCard(Texts.chooseCardToTrashFor('scrap'), 'estate');
        player.testOption(Texts.chooseXBenefitsFor(2, 'scrap'), Texts.plusOneAction);
        player.testOption(Texts.chooseXBenefitsFor(1, 'scrap'), Texts.gain(['silver']));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            expect(player.data.actions).to.equal(1);
            expect(player.allCardsTest).to.have.members(['throne room', 'scrap', 'gold', 'silver']);
            done();
        });
        game.start();
    })
});
