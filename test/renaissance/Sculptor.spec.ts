import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCULPTOR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sculptor']],
            d
        });
        player.testPlayAction('sculptor');
        player.testGain('sculptor', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.villagers).to.equal(1);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'sculptor']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'sculptor');
        player.testGain('sculptor', 'estate');
        player.testGain('sculptor', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.villagers).to.equal(1);
            expect(player.discardPile).to.have.members(['silver', 'estate']);
            done();
        });
        game.start();
    })
});
