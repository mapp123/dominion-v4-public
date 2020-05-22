import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE WORM', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the worm'],
            d
        });
        player.testPlayWay('way of the worm', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.exile).to.have.members(['estate']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the worm'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the worm');
        player.testConfirmWay('way of the worm');
        player.onBuyPhaseStart(() => {
            expect(player.exile).to.have.members(['estate', 'estate']);
            done();
        });
        game.start();
    });
});
