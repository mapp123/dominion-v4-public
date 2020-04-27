import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BRIDGE TROLL', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bridge troll'], ['silver']],
            d,
            players: 2
        });
        player.testPlayAction('bridge troll');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(q.data.tokens.minusOneCoin).to.equal(true);
            expect(game.getCostOfCard('silver').coin).to.equal(2);
        });
        q.testPlayTreasure('silver');
        q.onBuyPhaseStart(() => {
            expect(q.data.money).to.equal(1);
            expect(q.data.tokens.minusOneCoin).to.equal(false);
            expect(game.getCostOfCard('silver').coin).to.equal(3);
        });
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(game.getCostOfCard('silver').coin).to.equal(2);
        });
        q.onBuyPhaseStart(() => {
            expect(game.getCostOfCard('silver').coin).to.equal(3);
        })
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(1);
            expect(game.getCostOfCard('silver').coin).to.equal(3);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'bridge troll'], ['silver']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'bridge troll');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(q.data.tokens.minusOneCoin).to.equal(true);
            expect(game.getCostOfCard('silver').coin).to.equal(2);
        });
        q.testPlayTreasure('silver');
        q.onBuyPhaseStart(() => {
            expect(q.data.money).to.equal(1);
            expect(q.data.tokens.minusOneCoin).to.equal(false);
            expect(game.getCostOfCard('silver').coin).to.equal(3);
        });
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(game.getCostOfCard('silver').coin).to.equal(2);
        });
        q.onBuyPhaseStart(() => {
            expect(game.getCostOfCard('silver').coin).to.equal(3);
        });
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(1);
            expect(game.getCostOfCard('silver').coin).to.equal(3);
            done();
        });
        game.start();
    })
});
