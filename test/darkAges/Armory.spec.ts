import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ARMORY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['armory']],
            d
        });
        player.testPlayAction('armory');
        player.testGain('armory','silver');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'armory']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'armory');
        player.testGain('armory','silver');
        player.testGain('armory','estate');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['estate', 'silver']);
            done();
        });
        game.start();
    })
});
