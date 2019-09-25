import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RESEARCH', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['research', 'estate', 'copper', 'copper', 'copper', 'silver', 'gold', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('research');
        player.testChooseCard(Texts.chooseCardToTrashFor('research'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'research', 'estate', 'estate', 'copper', 'copper', 'silver', 'copper', 'silver', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'research');
        player.testChooseCard(Texts.chooseCardToTrashFor('research'), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashFor('research'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper', 'silver']);
            done();
        });
        game.start();
    })
});
