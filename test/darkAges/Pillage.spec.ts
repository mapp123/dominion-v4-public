import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PILLAGE', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['pillage'], ['copper', 'silver', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('pillage');
        player.testChooseCard(Texts.chooseCardForPlayerToDiscard(q.username), 'silver');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['pillage']);
            expect(player.discardPile).to.have.members(['spoils', 'spoils']);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(q.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        // Note that because pillage's effects are dependant on it's trashing, throne rooming pillage has no effect
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'pillage'], ['copper', 'silver', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'pillage');
        player.testChooseCard(Texts.chooseCardForPlayerToDiscard(q.username), 'silver');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['pillage']);
            expect(player.discardPile).to.have.members(['spoils', 'spoils']);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(q.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    })
});
