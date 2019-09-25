import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('FLEET', () => {
    it('works normally', (d) => {
        const [game, [player, q, r], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper'], [], ['silver', 'silver', 'copper']],
            activateCards: ['fleet'],
            d,
            players: 3
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('fleet');
        q.endTurn();
        r.testPlayTreasure('silver');
        r.testPlayTreasure('silver');
        r.testPlayTreasure('copper');
        r.testBuy('fleet');
        player.testEndGame();
        let playerGotExtraTurn = false;
        player.onBuyPhaseStart(() => {
            if (playerGotExtraTurn) {
                done();
            }
            else {
                done(new Error("Player should have got an extra turn."));
            }
        });
        r.testHookNextDecision(() => {
            playerGotExtraTurn = true;
        });
        r.endTurn();
        q.optional(() => {
            q.onBuyPhaseStart(() => {
                done(new Error("q should not get another turn"));
            });
        });
        game.start();
    });
});
