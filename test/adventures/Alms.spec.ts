import makeTestGame from "../testBed";
import { expect } from 'chai';

describe('ALMS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [[]],
            activateCards: ['alms'],
            d
        });
        player.testBuy('alms');
        player.testGain('alms', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('works once per turn', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['market']],
            activateCards: ['alms'],
            d
        });
        player.testPlayAction('market')
        player.testBuy('alms');
        player.testGain('alms', 'silver');
        player.testHookNextDecision((decision) => {
            expect((decision as any).gainRestrictions.allowedCards).to.not.include('alms');
            done();
        });
        player.endTurn();
        game.start();
    });
});
