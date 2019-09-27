import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('POOR HOUSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['poor house']],
            d
        });
        player.testPlayAction('poor house');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    });
    it('works with a hand', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['poor house', 'copper', 'copper']],
            d
        });
        player.testPlayAction('poor house');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with many cards', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['poor house', 'laboratory', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('laboratory');
        player.testPlayAction('poor house');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(0);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'poor house']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'poor house');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(8);
            done();
        });
        game.start();
    })
});
