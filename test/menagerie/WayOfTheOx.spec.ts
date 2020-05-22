import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE OX', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the ox'],
            d
        });
        player.testPlayWay('way of the ox', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the ox'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the ox');
        player.testConfirmWay('way of the ox');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    });
});
