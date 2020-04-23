import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TRANSMOGRIFY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['transmogrify', 'estate', 'estate', 'estate', 'estate']],
            d
        });
        player.testPlayAction('transmogrify');
        player.endTurn();
        player.call('transmogrify', () => {
            player.testChooseCard(Texts.chooseCardToTrashFor('transmogrify'), 'estate');
            player.testGain('transmogrify', 'silver');
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'estate', 'estate', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'transmogrify']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'transmogrify');
        player.onBuyPhaseStart(() => {
            expect(player.playArea).to.have.members(['throne room']);
            expect(player.data.tavernMat[0].card.name).to.equal("transmogrify");
            done();
        });
        game.start();
    })
});
