import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE MOLE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold']],
            activateCards: ['way of the mole'],
            d
        });
        player.testPlayWay('way of the mole', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'estate']],
            activateCards: ['way of the mole'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the mole');
        player.testConfirmWay('way of the mole');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['gold', 'gold', 'gold']);
            done();
        });
        game.start();
    });
});
