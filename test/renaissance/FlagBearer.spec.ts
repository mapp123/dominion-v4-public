import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import Flag from "../../src/cards/renaissance/Flag";

describe('FLAG BEARER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['flag bearer']],
            d
        });
        player.testPlayAction('flag bearer');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('gives the flag', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver'], ['flag bearer']],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('flag bearer');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
            expect(Flag.getI(game).belongsToPlayer).to.equal(player);
            done();
        });
        game.start();
    });
    it('gives the flag when trashed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['flag bearer', 'chapel']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'flag bearer');
        player.onBuyPhaseStart(() => {
            expect(Flag.getI(game).belongsToPlayer).to.equal(player);
            done();
        });
        game.start();
    });
    it('transfers correctly', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [
                ['flag bearer', 'chapel', 'copper', 'copper', 'copper', /* T2 */ 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', /* T3 */ 'copper', 'copper', 'copper', 'copper', 'copper', 'gold'],
                ['flag bearer', 'chapel', 'copper', 'copper', 'copper', /* T2 */ 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', /* T3 */ 'copper', 'copper', 'copper', 'copper', 'copper', 'gold']
            ],
            players: 2,
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'flag bearer');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.testHookNextDecision(() => {
            expect(Flag.getI(game).belongsToPlayer).to.equal(player);
        });
        player.endTurn();
        q.testPlayAction('chapel');
        q.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'flag bearer');
        q.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        q.testHookNextDecision(() => {
            expect(Flag.getI(game).belongsToPlayer).to.equal(q);
        });
        q.endTurn();
        player.testHookNextDecision(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
        });
        player.endTurn();
        q.testHookNextDecision(() => {
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
        });
        q.endTurn();
        player.testHookNextDecision(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
        });
        player.endTurn();
        q.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'flag bearer']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'flag bearer');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
