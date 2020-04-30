import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SWAMP HAG', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['swamp hag'], []],
            d,
            players: 2
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('swamp hag');
        player.endTurn();
        q.testBuy('copper');
        q.testHookEndTurn(() => {
            expect(q.hand).to.have.members(['copper', 'curse']);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'swamp hag'], []],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'swamp hag');
        player.endTurn();
        q.testBuy('copper');
        q.testHookEndTurn(() => {
            expect(q.hand).to.have.members(['copper', 'curse', 'curse']);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            expect(player.data.money).to.equal(6);
            done();
        });
        game.start();
    })
});
