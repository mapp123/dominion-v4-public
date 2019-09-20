import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PRIEST', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['priest', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('priest');
        player.testChooseCard(Texts.chooseCardToTrashFor('priest'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'priest', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'priest');
        player.testChooseCard(Texts.chooseCardToTrashFor('priest'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('priest'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(6); // 2 (initial play), 2 (second play), 2 (trash from second play with effect from first)
            done();
        });
        game.start();
    })
});
