import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE CAMEL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'gold', 'gold']],
            activateCards: ['way of the camel'],
            d
        });
        player.testPlayWay('way of the camel', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['smithy', 'gold', 'gold', 'gold']);
            expect(player.discardPile).to.be.empty;
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('gold');
        player.testConfirm(Texts.wantDiscardFromExile('gold'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['smithy', 'gold', 'gold', 'gold', 'gold']);
            expect(player.data.exile).to.be.empty;
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'gold', 'gold']],
            activateCards: ['way of the camel'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the camel');
        player.testConfirmWay('way of the camel');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['throne room', 'smithy', 'gold', 'gold', 'gold', 'gold']);
            expect(player.discardPile).to.be.empty;
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('gold');
        player.testConfirm(Texts.wantDiscardFromExile('gold'), true);
        player.optional(() => {
            player.testPlayAction('No Card');
        });
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['throne room', 'smithy', 'gold', 'gold', 'gold', 'gold', 'gold']);
            expect(player.data.exile).to.be.empty;
            done();
        });
        game.start();
    });
});
