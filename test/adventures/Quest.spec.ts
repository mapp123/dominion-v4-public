import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('QUEST', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['attack']],
            activateCards: ['quest'],
            d
        });
        player.testPlayAction('No Card');
        player.testBuy('quest');
        player.testOption(Texts.chooseOptionFor('quest'), Texts.discardA('attack'));
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['attack', 'gold']);
            done();
        });
        game.start();
    });
    it('works with discard curse', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['curse', 'curse']],
            activateCards: ['quest'],
            d
        });
        player.testBuy('quest');
        player.testOption(Texts.chooseOptionFor('quest'), Texts.discardXYs('2', 'curses'));
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['curse', 'curse', 'gold']);
            done();
        });
        game.start();
    });
    it('works with discard 6', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['quest'],
            d
        });
        player.testPlayAction('smithy');
        player.testBuy('quest');
        player.testOption(Texts.chooseOptionFor('quest'), Texts.discardXCards('6'));
        player.testChooseCard(Texts.chooseCardToDiscardFor('quest'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('quest'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('quest'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('quest'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('quest'), 'copper');
        player.testHookEndTurn(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'gold']);
            done();
        });
        game.start();
    });
    it('works with partial fill', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['curse']],
            activateCards: ['quest'],
            d
        });
        player.testBuy('quest');
        player.testOption(Texts.chooseOptionFor('quest'), Texts.discardXYs('2', 'curses'));
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['curse']);
            done();
        });
        game.start();
    });
});
