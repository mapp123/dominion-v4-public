import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE BUTTERFLY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the butterfly', 'market', 'library'],
            d
        });
        player.testPlayWay('way of the butterfly', 'smithy');
        player.testGain('way of the butterfly', 'market');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['market']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the butterfly', 'market', 'library'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the butterfly');
        player.testGain('way of the butterfly', 'market');
        player.testConfirmWay('way of the butterfly');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['market', 'throne room']);
            done();
        });
        game.start();
    });
});
