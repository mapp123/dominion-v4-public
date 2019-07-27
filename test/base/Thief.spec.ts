import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('THIEF', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['thief', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('thief');
        player.testChooseCard(Texts.chooseATreasureToTrashFor(q.username), 'silver');
        player.testChooseCard(Texts.chooseCardToGainFromTrashed, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver']);
            expect(q.discardPile).to.have.members(['gold']);
            expect(q.deck.cards.length).to.equal(0);
            done();
        });
        game.start();
    });
    it('works with no treasures', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['thief', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'estate', 'estate']],
            d,
            players: 2
        });
        player.testPlayAction('thief');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members([]);
            expect(q.discardPile).to.have.members(['estate', 'estate']);
            expect(q.deck.cards.length).to.equal(0);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'thief', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'thief');
        player.testChooseCard(Texts.chooseATreasureToTrashFor(q.username), 'silver');
        player.testChooseCard(Texts.chooseCardToGainFromTrashed, 'silver');
        player.testChooseCard(Texts.chooseATreasureToTrashFor(q.username), 'gold');
        player.testChooseCard(Texts.chooseCardToGainFromTrashed, 'No Card');
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['silver', 'gold']);
            expect(player.discardPile).to.have.members(['silver']);
            expect(game.trash.map((a) => a.name)).to.have.members(['gold']);
            done();
        });
        game.start();
    })
});
