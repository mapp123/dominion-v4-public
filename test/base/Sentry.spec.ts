import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SENTRY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sentry', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('sentry');
        player.testOption(Texts.whatToDoWith('silver'), 'Keep It');
        player.testOption(Texts.whatToDoWith('gold'), 'Keep It');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['silver', 'gold']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('works normally -- trash one', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sentry', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'estate']],
            d
        });
        player.testPlayAction('sentry');
        player.testOption(Texts.whatToDoWith('silver'), 'Keep It');
        player.testOption(Texts.whatToDoWith('estate'), 'Trash It');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['silver']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'sentry', 'copper', 'copper', 'copper', 'copper', 'silver', 'estate', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'sentry');
        player.testOption(Texts.whatToDoWith('silver'), 'Keep It');
        player.testOption(Texts.whatToDoWith('estate'), 'Trash It');
        player.testOption(Texts.whatToDoWith('silver'), 'Discard It');
        player.testOption(Texts.whatToDoWith('gold'), 'Keep It');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['gold']);
            expect(player.discardPile).to.have.members(['silver']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
