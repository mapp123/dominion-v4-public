import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RATS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['rats', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('rats');
        player.testChooseCard(Texts.chooseCardToTrashFor('rats'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.discardPile).to.have.members(['rats']);
            done();
        });
        game.start();
    });
    it('handles a hand of all Rats', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['rats', 'rats', 'rats', 'rats', 'rats', 'rats']],
            d
        });
        player.testPlayAction('rats');
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['rats', 'rats', 'rats', 'rats', 'rats']);
            expect(player.data.actions).to.equal(1);
            expect(player.discardPile).to.have.members(['rats']);
            done();
        });
        game.start();
    });
    it('responds to trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['rats', 'chapel', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'rats');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(game.trash.map((a) => a.name)).to.have.members(['rats']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'rats', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'rats');
        player.testChooseCard(Texts.chooseCardToTrashFor('rats'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('rats'), 'copper');
        // We have another rats in our hand now that we don't want to play.
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'silver', 'rats']);
            expect(player.discardPile).to.have.members(['rats']);
            done();
        });
        game.start();
    })
});
