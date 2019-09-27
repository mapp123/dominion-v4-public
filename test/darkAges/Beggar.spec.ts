import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BEGGAR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['beggar', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('beggar');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper','copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('reacts', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['attack'], ['beggar']],
            d,
            players: 2
        });
        player.testPlayAction('attack');
        q.testConfirm(Texts.doYouWantToDiscardAnAForB('beggar', 'attack'), true);
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['beggar', 'silver']);
            // The attack forces q to draw
            expect(q.hand).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'beggar', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'beggar');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
