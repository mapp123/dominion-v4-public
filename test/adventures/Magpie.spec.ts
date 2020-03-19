import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MAGPIE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['magpie', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('magpie');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with actions', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['magpie', 'copper', 'copper', 'copper', 'copper', 'silver', 'magpie']],
            d
        });
        player.testPlayAction('magpie');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['magpie']);
            expect(player.discardPile).to.have.members(['magpie']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'magpie', 'copper', 'copper', 'copper', 'silver', 'gold', 'silver', 'magpie']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'magpie');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold', 'silver']);
            expect(player.data.actions).to.equal(2);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['magpie']);
            expect(player.discardPile).to.have.members(['magpie']);
            done();
        });
        game.start();
    })
});
