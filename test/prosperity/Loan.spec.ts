import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LOAN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['loan', 'copper', 'copper', 'copper', 'copper', 'estate', 'duchy', 'copper']],
            d
        });
        player.testPlayTreasure('loan');
        player.testOption(Texts.whatToDoWith('copper'), 'Trash It');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.deck.cards.length).to.equal(0);
            expect(player.discardPile).to.have.members(['estate', 'duchy']);
            done();
        });
        game.start();
    });
    it('works with no cards on the deck', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['loan', 'copper', 'copper', 'copper', 'copper', 'estate', 'duchy']],
            d
        });
        player.testPlayTreasure('loan');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.deck.cards.length).to.equal(0);
            expect(player.discardPile).to.have.members(['estate', 'duchy']);
            expect(player.game.trash.length).to.equal(0);
            done();
        });
        game.start();
    });
    it('works with discard', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['loan', 'copper', 'copper', 'copper', 'copper', 'estate', 'duchy', 'copper']],
            d
        });
        player.testPlayTreasure('loan');
        player.testOption(Texts.whatToDoWith('copper'), 'Discard It');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.deck.cards.length).to.equal(0);
            expect(player.discardPile).to.have.members(['estate', 'duchy', 'copper']);
            done();
        });
        game.start();
    });
});
