import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('POACHER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['poacher', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('poacher');
        player.testChooseCard(Texts.chooseCardToDiscardFor('poacher'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['copper']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'poacher', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'poacher');
        player.testChooseCard(Texts.chooseCardToDiscardFor('poacher'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('poacher'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['copper', 'silver']);
            expect(player.data.money).to.equal(2);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
