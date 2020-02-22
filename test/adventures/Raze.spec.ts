import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RAZE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['raze', 'estate', 'copper', 'copper', 'copper', 'silver', 'gold', 'copper']],
            d
        });
        player.testPlayAction('raze');
        player.testChooseCard(Texts.chooseCardToTrashFor('raze'), 'estate');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'gold']);
            expect(player.discardPile).to.have.members(['silver']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            expect(player.playArea).to.have.members(['raze']);
            done();
        });
        game.start();
    });
    it('self trashes', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['raze', 'estate', 'copper', 'copper', 'copper', 'silver', 'gold', 'copper']],
            d
        });
        player.testPlayAction('raze');
        player.testChooseCard(Texts.chooseCardToTrashFor('raze'), 'raze');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['estate', 'copper', 'copper', 'copper', 'gold']);
            expect(player.discardPile).to.have.members(['silver']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            expect(player.playArea).to.have.members([]);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'raze', 'copper', 'copper', 'copper', 'silver', 'gold', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'raze');
        player.testChooseCard(Texts.chooseCardToTrashFor('raze'), 'raze');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'gold');
        player.testChooseCard(Texts.chooseCardToTrashFor('raze'), 'raze');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'gold']);
            expect(player.discardPile).to.have.members(['silver']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            expect(player.playArea).to.have.members(['throne room']);
            done();
        });
        game.start();
    })
});
