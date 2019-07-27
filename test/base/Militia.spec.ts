import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MILITIA', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['militia', 'copper', 'copper', 'copper', 'copper'], ['silver', 'silver', 'silver', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('militia');
        q.testChooseCard(Texts.chooseCardToDiscardFor('militia'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('militia'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(q.hand).to.have.members(['silver', 'silver', 'silver']);
            expect(q.discardPile).to.have.members(['copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'militia', 'copper', 'copper', 'copper'], ['silver', 'silver', 'silver', 'estate', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'militia');
        q.testChooseCard(Texts.chooseCardToDiscardFor('militia'), 'estate');
        q.testChooseCard(Texts.chooseCardToDiscardFor('militia'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(q.hand).to.have.members(['silver', 'silver', 'silver']);
            expect(q.discardPile).to.have.members(['estate', 'copper']);
            done();
        });
        game.start();
    })
});
