import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GRAND MARKET', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['grand market', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('grand market');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.money).to.equal(2);
            expect(player.data.actions).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'grand market',  'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'grand market');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.money).to.equal(4);
            expect(player.data.actions).to.equal(2);
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    });
    it('blocks copper', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold']],
            d
        });
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testHookNextDecision((decision) => {
            expect(decision.decision).to.equal('buy');
            expect((decision as any).gainRestrictions.allowedCards).to.not.contain('grand market');
        });
        player.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    });
});
