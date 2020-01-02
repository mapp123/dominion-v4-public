import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('REBUILD', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['rebuild', 'copper', 'copper', 'copper', 'copper', 'copper', 'estate']],
            d
        });
        player.testPlayAction('rebuild');
        player.testChooseCard(Texts.chooseCardToNameFor('rebuild'), 'duchy');
        player.testGain('rebuild', 'duchy');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['estate']);
            expect(player.discardPile).to.have.members(['copper', 'duchy']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with no victory cards', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['rebuild', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('rebuild');
        player.testChooseCard(Texts.chooseCardToNameFor('rebuild'), 'duchy');
        player.onBuyPhaseStart(() => {
            expect(game.trash.length).to.have.equal(0);
            expect(player.discardPile).to.have.members(['copper', 'copper']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'rebuild', 'copper', 'copper', 'copper', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'rebuild');
        player.testChooseCard(Texts.chooseCardToNameFor('rebuild'), 'duchy');
        player.testGain('rebuild', 'duchy');
        player.testChooseCard(Texts.chooseCardToNameFor('rebuild'), 'province');
        player.testGain('rebuild', 'province');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['estate', 'duchy']);
            expect(player.discardPile).to.have.members(['province']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
