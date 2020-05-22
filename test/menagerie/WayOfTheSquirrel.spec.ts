import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE SQUIRREL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            activateCards: ['way of the squirrel'],
            d
        });
        player.testPlayWay('way of the squirrel', 'smithy');
        player.endTurn();
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            activateCards: ['way of the squirrel'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the squirrel');
        player.testConfirmWay('way of the squirrel');
        player.endTurn();
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    });
});
