import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE MONKEY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the monkey'],
            d
        });
        player.testPlayWay('way of the monkey', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the monkey'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the monkey');
        player.testConfirmWay('way of the monkey');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
});
