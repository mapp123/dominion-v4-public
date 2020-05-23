import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('SUPPLIES', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['supplies']],
            d
        });
        player.testPlayTreasure('supplies');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['horse']);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
});
