import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FEAST', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['feast']],
            d
        });
        player.testPlayAction('feast');
        player.testGain('feast', 'duchy');
        player.onBuyPhaseStart(() => {
            expect(player.game.trash.map((a) => a.name)).to.have.members(['feast']);
            expect(player.discardPile).to.have.members(['duchy']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'feast']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'feast');
        player.testGain('feast', 'duchy');
        player.testGain('feast', 'duchy');
        player.onBuyPhaseStart(() => {
            expect(player.game.trash.map((a) => a.name)).to.have.members(['feast']);
            expect(player.discardPile).to.have.members(['duchy', 'duchy']);
            done();
        });
        game.start();
    })
});
