import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LOST CITY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['lost city', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('lost city');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('reacts to gain', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2,
            activateCards: ['lost city']
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('lost city');
        player.testHookEndTurn(() => {
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'lost city', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'lost city');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
