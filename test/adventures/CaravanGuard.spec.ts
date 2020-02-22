import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CARAVAN GUARD', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['caravan guard', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('caravan guard');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
        });
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            done();
        })
        game.start();
    });
    it('plays out of hand', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['attack'], ['caravan guard', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('attack');
        q.testConfirm(Texts.doYouWantToPlay('caravan guard'), true);
        player.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
        });
        q.onBuyPhaseStart(() => {
            expect(q.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('stops asking', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['attack'], ['caravan guard', 'silver', 'caravan guard', 'copper', 'copper', 'caravan guard', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('attack');
        q.testConfirm(Texts.doYouWantToPlay('caravan guard'), true);
        q.testConfirm(Texts.doYouWantToPlay('caravan guard'), false);
        player.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['caravan guard', 'caravan guard', 'copper', 'copper', 'silver', 'gold']);
        });
        q.testPlayAction('No Card');
        q.onBuyPhaseStart(() => {
            expect(q.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'caravan guard', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'caravan guard');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
        });
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    })
});
