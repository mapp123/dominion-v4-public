import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ROGUE', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['rogue'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('rogue');
        q.testChooseCard(Texts.chooseCardToTrashFor('rogue'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(q.deck.cards.length).to.equal(0);
            expect(q.discardPile).to.have.members(['gold']);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'rogue'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'rogue');
        q.testChooseCard(Texts.chooseCardToTrashFor('rogue'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(q.deck.cards.length).to.equal(0);
            expect(q.discardPile).to.have.members(['gold']);
            expect(game.trash.length).to.equal(0);
            expect(player.discardPile).to.have.members(['silver']);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
