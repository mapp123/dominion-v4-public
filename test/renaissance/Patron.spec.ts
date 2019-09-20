import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PATRON', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['patron']],
            d
        });
        player.testPlayAction('patron');
        player.onBuyPhaseStart(() => {
            expect(player.data.villagers).to.equal(1);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('works when revealed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['thief', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'patron']],
            d,
            players: 2
        });
        player.testPlayAction('thief');
        player.onBuyPhaseStart(() => {
            expect(q.data.coffers).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'patron']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'patron');
        player.onBuyPhaseStart(() => {
            expect(player.data.villagers).to.equal(2);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
