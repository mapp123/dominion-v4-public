import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('REMODEL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['remodel', 'copper', 'copper', 'copper', 'estate']],
            d
        });
        player.testPlayAction('remodel');
        player.testChooseCard(Texts.chooseCardToTrashFor('remodel'), 'estate');
        player.testGain('remodel', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'remodel', 'estate', 'estate', 'remodel']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'remodel');
        player.testChooseCard(Texts.chooseCardToTrashFor('remodel'), 'estate');
        player.testGain('remodel', 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('remodel'), 'remodel');
        player.testGain('remodel', 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate']);
            expect(player.discardPile).to.have.members(['silver', 'gold']);
            done();
        });
        game.start();
    })
});
