import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MOUNTAIN VILLAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mountain village', 'copper', 'copper', 'copper', 'copper', 'silver']],
            discards: [['copper', 'gold']],
            d
        });
        player.testPlayAction('mountain village');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('works with no discard', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mountain village', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('mountain village');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'mountain village', 'copper', 'copper', 'copper']],
            discards: [['copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mountain village');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'silver');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    })
});
