import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WORKSHOP', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['workshop', 'estate', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('workshop');
        player.testGain('workshop', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'estate']);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['workshop', 'throne room', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'workshop');
        player.testGain('workshop', 'silver');
        player.testGain('workshop', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['silver', 'silver']);
            done();
        });
        game.start();
    })
});