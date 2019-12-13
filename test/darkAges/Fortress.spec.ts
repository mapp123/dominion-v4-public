import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FORTRESS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['fortress', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('fortress');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('returns to hand when trashed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['fortress', 'chapel', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'fortress');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'fortress']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'fortress', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'fortress');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
