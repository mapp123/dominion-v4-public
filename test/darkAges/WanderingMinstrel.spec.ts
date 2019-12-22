import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WANDERING MINSTREL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['wandering minstrel', 'copper', 'copper', 'copper', 'copper', 'silver', 'market', 'cellar', 'copper']],
            d
        });
        player.testPlayAction('wandering minstrel');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['market', 'cellar']);
            expect(player.discardPile).to.have.members(['copper']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'wandering minstrel', 'copper', 'copper', 'copper', 'silver', 'market', 'cellar', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'wandering minstrel');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'market']);
            expect(player.discardPile).to.have.members(['copper', 'silver', 'gold']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['cellar']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
