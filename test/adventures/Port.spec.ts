import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PORT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['port', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('port');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('self duplicates', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['port'],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('port');
        player.testHookEndTurn(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['port', 'port', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'port', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'port');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    })
});
