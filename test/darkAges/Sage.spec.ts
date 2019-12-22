import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sage', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('sage');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['copper']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with an empty deck', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sage', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('sage');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'sage', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper']],
            discards: [['silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'sage');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.discardPile).to.have.members(['copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
