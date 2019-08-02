import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CITY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['city', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('city');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with two piles gone', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['city', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        game.injectEmptySupplyPile();
        player.testPlayAction('city');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'city', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'city');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
