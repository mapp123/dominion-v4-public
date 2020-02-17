import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RATCATCHER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ratcatcher', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('ratcatcher');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.tavernMat.map(a => a.card.name)).to.have.members(['ratcatcher']);
        });
        player.call('ratcatcher', () => {
            player.testChooseCard(Texts.chooseCardToTrashFor('ratcatcher'), 'copper');
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.game.trash.map(a => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ratcatcher', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ratcatcher');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.tavernMat.map(a => a.card.name)).to.have.members(['ratcatcher']);
        });
        player.call('ratcatcher', () => {
            player.testChooseCard(Texts.chooseCardToTrashFor('ratcatcher'), 'copper');
        });
        player.optional(() => {
            player.testPlayAction('No Card');
        })
        player.onBuyPhaseStart(() => {
            expect(player.game.trash.map(a => a.name)).to.have.members(['copper']);
            expect(player.data.tavernMat.length).to.equal(0);
            done();
        });
        game.start();
    })
});
