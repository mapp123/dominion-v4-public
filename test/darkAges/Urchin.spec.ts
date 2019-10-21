import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('URCHIN', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['urchin', 'copper', 'copper', 'copper', 'copper', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('urchin');
        q.testChooseCard(Texts.chooseCardToDiscardFor('urchin'),'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('gains a mercenary', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['urchin', 'attack', 'copper', 'copper', 'copper', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('urchin');
        q.testChooseCard(Texts.chooseCardToDiscardFor('urchin'),'copper');
        player.testPlayAction('attack');
        player.testConfirm(Texts.doYouWantToTrashAToB('urchin', 'gain a mercenary'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['mercenary']);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'urchin', 'copper', 'copper', 'copper', 'silver', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'urchin');
        q.testChooseCard(Texts.chooseCardToDiscardFor('urchin'),'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
