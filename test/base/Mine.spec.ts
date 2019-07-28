import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MINE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mine', 'silver']],
            d
        });
        player.testPlayAction('mine');
        player.testChooseCard(Texts.chooseATreasureToTrashFor('mine'), 'silver');
        player.testGain('mine', 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'mine', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mine');
        player.testChooseCard(Texts.chooseATreasureToTrashFor('mine'), 'copper');
        player.testGain('mine', 'silver');
        player.testChooseCard(Texts.chooseATreasureToTrashFor('mine'), 'silver');
        player.testGain('mine', 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['gold']);
            done();
        });
        game.start();
    })
});
