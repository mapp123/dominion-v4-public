import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MESSENGER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['messenger', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('messenger');
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(2);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('reacts to buy', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2,
            activateCards: ['messenger']
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('messenger');
        player.testGain('messenger', 'silver');
        q.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'messenger', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'messenger');
        player.testConfirm(Texts.placeDeckIntoDiscard, false);
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(4);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    })
});
