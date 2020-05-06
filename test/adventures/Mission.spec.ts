import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MISSION', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver', 'silver']],
            activateCards: ['mission', 'plan', 'market'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('mission');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testHookNextDecision((d) => {
            console.log(d);
            expect((d as any).gainRestrictions.allowedCards).to.have.members(['plan']);
        });
        player.testBuy('plan');
        player.testGain(Texts.whereWantXToken('trashing'), 'market');
        player.testHookEndTurn(() => {
            expect(player.data.tokens.trashing).to.equal("market");
            // Expect q to be skipped, because we got to play two turns with Mission
            expect(q.turnNumber).to.equal(0);
            expect(player.turnNumber).to.equal(2);
            done();
        });
        game.start();
    });
});
