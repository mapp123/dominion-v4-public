import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('SPOILS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['spoils']],
            d
        });
        player.testPlayTreasure('spoils');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            expect(player.deck.cards.length).to.equal(0);
            expect(player.discardPile.length).to.equal(0);
            // It's 16, not 15, because we artificially add one by having it at start
            expect(game.supply.getPile('spoils')?.length).to.equal(16);
            done();
        });
        game.start();
    });
});
