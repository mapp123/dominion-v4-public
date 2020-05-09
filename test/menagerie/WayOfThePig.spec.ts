import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE PIG', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            activateCards: ['way of the pig'],
            d
        });
        player.testPlayWay('way of the pig', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'gold', 'gold']],
            activateCards: ['way of the pig'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the pig');
        player.testConfirmWay('way of the pig');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    });
});
