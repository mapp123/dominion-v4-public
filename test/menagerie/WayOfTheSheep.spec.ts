import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE SHEEP', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the sheep'],
            d
        });
        player.testPlayWay('way of the sheep', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the sheep'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the sheep');
        player.testConfirmWay('way of the sheep');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    });
});
