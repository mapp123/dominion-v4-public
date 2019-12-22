import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COUNT', () => {
    it('works normally first choices', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['count', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('count');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.discardXCards("2"));
        player.testChooseCard(Texts.chooseCardToDiscardFor('count'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('count'), 'copper');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.extraMoney("3"));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper']);
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
    it('works normally second choices', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['count', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('count');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.putACardFromYourHandOnTopOfYourDeck);
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'copper');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.trashYourHand);
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['copper', 'copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('works normally third choices', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['count', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('count');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['copper']));
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['duchy']));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['copper', 'duchy']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'count', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'count');
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['copper']));
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['duchy']));
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['copper']));
        player.testOption(Texts.chooseBenefitFor('count'), Texts.gain(['duchy']));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['copper', 'duchy', 'copper', 'duchy']);
            done();
        });
        game.start();
    })
});
