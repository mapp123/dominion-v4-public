import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TREASURE HUNTER', () => {
    it('works normally', (d) => {
        const [game, [q, player], done] = makeTestGame({
            decks: [[], ['treasure hunter']],
            d,
            players: 2
        });
        q.testBuy('copper');
        player.testPlayAction('treasure hunter');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            expect(player.discardPile).to.have.members(['silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('treasure hunter', 'warrior'), true);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['warrior', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [q, player], done] = makeTestGame({
            decks: [[], ['throne room', 'treasure hunter']],
            d,
            players: 2
        });
        q.testBuy('copper');
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'treasure hunter');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(2);
            expect(player.discardPile).to.have.members(['silver', 'silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('treasure hunter', 'warrior'), true);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['warrior', 'silver', 'silver', 'throne room']);
            done();
        });
        game.start();
    })
});
