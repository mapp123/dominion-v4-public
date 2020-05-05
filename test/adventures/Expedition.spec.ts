import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('EXPEDITION', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold', 'duchy']],
            activateCards: ['expedition'],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayTreasure('gold');
        player.testBuy('expedition');
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['silver', 'gold', 'duchy', 'gold', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
