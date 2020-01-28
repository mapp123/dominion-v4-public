import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DISCIPLE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['disciple', 'village']],
            d
        });
        player.testPlayAction('disciple');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'village');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.discardPile).to.have.members(['village']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('disciple', 'teacher'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['village', 'village', 'teacher']);
            done();
        });
        game.start();
    });
    it('cannot gain non-supply', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['disciple', 'disciple']],
            d
        });
        player.testPlayAction('disciple');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'disciple');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members([]);
            done();
        });
        player.optional(() => {
            player.testConfirm(Texts.doYouWantToExchangeXForY('disciple', 'teacher'), false);
            player.testConfirm(Texts.doYouWantToExchangeXForY('disciple', 'teacher'), false);
        });
        game.start();
    });
});
