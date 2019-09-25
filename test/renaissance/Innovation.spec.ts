import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('INNOVATION', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver', 'silver', 'silver', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            activateCards: ['innovation', 'attack'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('innovation');
        q.endTurn();
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('attack');
        player.testConfirm(Texts.wouldYouLikeToSetAsideThe('attack', 'innovation'), true);
        q.onBuyPhaseStart(() => {
            expect(q.hand.length).to.equal(6);
            done();
        });
        game.start();
    });
});
