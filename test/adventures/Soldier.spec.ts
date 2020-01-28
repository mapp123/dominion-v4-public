import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SOLDIER', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['soldier'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('soldier');
        q.testChooseCard(Texts.chooseCardToDiscardFor('soldier'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(q.data.hand.length).to.equal(4);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('soldier', 'fugitive'), true);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['fugitive']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'soldier'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'soldier');
        q.testChooseCard(Texts.chooseCardToDiscardFor('soldier'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('soldier'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(q.data.hand.length).to.equal(3);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('soldier', 'fugitive'), true);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['fugitive', 'throne room']);
            done();
        });
        game.start();
    })
});
