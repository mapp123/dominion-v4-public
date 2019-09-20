import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SEER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['seer', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'copper', 'copper']],
            d
        });
        player.testPlayAction('seer');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper', 'copper']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'seer', 'copper', 'copper', 'copper', 'silver', 'silver', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'seer');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper', 'gold']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'copper', 'silver']);
            done();
        });
        game.start();
    })
});
