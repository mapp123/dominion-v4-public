import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RABBLE', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['rabble', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper', 'attack', 'estate', 'silver']],
            d,
            players: 2
        });
        game.injectTestAttack();
        player.testPlayAction('rabble');
        player.onBuyPhaseStart(() => {
            expect(q.deck.cards.map((a) => a.name)).to.have.members(['estate']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'rabble', 'copper', 'copper', 'copper', 'silver', 'gold', 'gold', 'silver', 'silver', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper', 'attack', 'estate', 'silver', 'estate', 'duchy']],
            d,
            players: 2
        });
        game.injectTestAttack();
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'rabble');
        q.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(q.deck.cards.map((a) => a.name)).to.have.ordered.members(['estate', 'estate', 'duchy']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
