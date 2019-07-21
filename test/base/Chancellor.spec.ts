import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CHANCELLOR', () => {
    it('works -- deck into discard', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chancellor', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chancellor');
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.deck.discard.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('works -- no deck into discard', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chancellor', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chancellor');
        player.testConfirm(Texts.placeDeckIntoDiscard, false);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chancellor', 'throne room', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'chancellor');
        player.testConfirm(Texts.placeDeckIntoDiscard, false);
        player.testHookNextDecision(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(player.deck.discard.map((a) => a.name).length).to.equal(0);
        });
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.deck.discard.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});