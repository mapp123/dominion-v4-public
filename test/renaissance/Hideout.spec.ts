import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HIDEOUT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hideout', 'copper', 'copper', 'copper', 'estate', 'silver']],
            d,
            players: 2 // Add second player so curse pile is not empty
        });
        player.testPlayAction('hideout');
        player.testChooseCard(Texts.chooseCardToTrashFor('hideout'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['curse']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'hideout', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'hideout');
        player.testChooseCard(Texts.chooseCardToTrashFor('hideout'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('hideout'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver']);
            expect(player.discardPile).to.have.members([]);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});
