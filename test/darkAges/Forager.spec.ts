import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FORAGER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['forager', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('forager');
        player.testChooseCard(Texts.chooseCardToTrashFor('forager'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with chapel', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['forager', 'chapel', 'copper', 'estate', 'silver']],
            d
        });
        player.testHookNextDecision(() => {
            player.data.actions++;
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.testPlayAction('forager');
        // No forager decision, as it will default to last card
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            expect(player.data.actions).to.equal(1);
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'forager', 'copper', 'silver', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'forager');
        player.testChooseCard(Texts.chooseCardToTrashFor('forager'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('forager'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    })
});
