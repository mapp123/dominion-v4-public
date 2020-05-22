import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE RAT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper']],
            activateCards: ['way of the rat'],
            d
        });
        player.testPlayWay('way of the rat', 'smithy');
        player.testChooseCard(Texts.discardAForBenefit('treasure', 1, 'gain a smithy'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.be.empty;
            expect(player.discardPile).to.have.members(['copper', 'smithy']);
            expect(player.allCardsTest).to.have.members(['copper', 'smithy', 'smithy']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper']],
            activateCards: ['way of the rat'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the rat');
        player.testChooseCard(Texts.discardAForBenefit('treasure', 1, 'gain a smithy'), 'copper');
        player.testConfirmWay('way of the rat');
        player.testChooseCard(Texts.discardAForBenefit('treasure', 1, 'gain a smithy'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.be.empty;
            expect(player.discardPile).to.have.members(['copper', 'copper', 'smithy', 'smithy']);
            expect(player.allCardsTest).to.have.members(['copper', 'copper', 'smithy', 'smithy', 'smithy', 'throne room']);
            done();
        });
        game.start();
    });
});
