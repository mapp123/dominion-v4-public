import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MADMAN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['madman', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.testPlayAction('madman');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'madman', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'madman');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    })
});
