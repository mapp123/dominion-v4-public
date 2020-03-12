import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GUIDE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['guide', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.testPlayAction('guide');
        player.deck.shouldShuffle = false;
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
        });
        player.testHookNextDecision(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'silver', 'silver', 'silver']);
        });
        player.call('guide', () => {});
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'guide', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'guide');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
        });
        player.call('guide', () => {});
        player.onBuyPhaseStart(() => {
            expect(player.playArea).to.have.members(['guide']);
            expect(player.hand).to.have.members(['throne room', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
