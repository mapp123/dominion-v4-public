import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('ROAD NETWORK', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'silver'], ['silver']],
            activateCards: ['road network'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('road network');
        q.testPlayTreasure('silver');
        q.testBuy('estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand.length).to.equal(6);
            done();
        });
        game.start();
    });
});
