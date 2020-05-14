import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE FROG', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['way of the frog'],
            d
        });
        player.testPlayWay('way of the frog', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
        });
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['smithy', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['way of the frog'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the frog');
        player.testConfirmWay('way of the frog');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
        });
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['smithy', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
