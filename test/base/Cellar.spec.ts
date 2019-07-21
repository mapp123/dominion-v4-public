import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CELLAR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['cellar', 'estate', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('cellar');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'estate');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['cellar', 'estate', 'throne room', 'estate', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'cellar');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'estate');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'No Card');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'estate');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});