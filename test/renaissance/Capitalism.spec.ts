import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CAPITALISM', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'militia'], ['moat', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['capitalism'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('capitalism');
        q.testPlayAction('No Card');
        q.testHookNextDecision(() => {
            const card = player.data.hand.find((a) => a.name === 'militia');
            expect(card).to.not.be.null;
            expect(card!.types).to.have.members(['action', 'attack']);
        });
        q.endTurn();
        player.testHookNextDecision(() => {
            const card = player.data.hand.find((a) => a.name === 'militia');
            expect(card).to.not.be.null;
            expect(card!.types).to.have.members(['action', 'attack', 'treasure']);
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('militia');
        q.testConfirm(Texts.doYouWantToReveal('moat'), true);
        player.onBuyPhaseStart(() => {
            expect(q.hand.length).to.equal(5);
            done();
        });
        game.start();
    });
});
