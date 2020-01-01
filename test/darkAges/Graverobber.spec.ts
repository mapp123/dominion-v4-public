import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GRAVEROBBER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['village', 'chapel', 'graverobber', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('village');
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'gold');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.testPlayAction('graverobber');
        player.testOption(Texts.chooseBenefitFor('graverobber'), "Gain a card from the trash");
        player.testInvalid().testChooseCard(Texts.chooseCardToGainFor('graverobber'), 'copper');
        player.testChooseCard(Texts.chooseCardToGainFor('graverobber'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.length).to.equal(1);
            expect(player.deck.cards[0].name).to.equal('silver');
            done();
        });
        game.start();
    });
    it('works with trash action', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['graverobber', 'copper', 'silver', 'village', 'ruined village']],
            d
        });
        player.testPlayAction('graverobber');
        player.testOption(Texts.chooseBenefitFor('graverobber'), Texts.trashA('action card') + " and gain a card costing up to $3 more");
        player.testChooseCard(Texts.chooseCardToTrashFor('graverobber'), 'ruined village');
        player.testGain('graverobber', 'village');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['ruined village']);
            expect(player.discardPile).to.have.members(['village']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'graverobber', 'village', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'graverobber');
        player.testOption(Texts.chooseBenefitFor('graverobber'), Texts.trashA('action card') + " and gain a card costing up to $3 more");
        // player.testChooseCard(Texts.chooseCardToTrashFor('graverobber'), 'village');
        player.testGain('graverobber', 'gold');
        player.testOption(Texts.chooseBenefitFor('graverobber'), "Gain a card from the trash");
        // player.testChooseCard(Texts.chooseCardToGainFor('graverobber'), 'village');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.length).to.equal(1);
            expect(player.deck.cards[0].name).to.equal('village');
            expect(player.discardPile).to.have.members(['gold']);
            done();
        });
        game.start();
    })
});
