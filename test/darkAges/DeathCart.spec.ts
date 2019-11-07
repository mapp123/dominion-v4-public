import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DEATH CART', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['death cart', 'ruined village']],
            d
        });
        player.testPlayAction('death cart');
        player.testChooseCard(Texts.trashForBenefit("+$5", 1), 'ruined village');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(5);
            done();
        });
        game.start();
    });
    it('gains ruins on gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver'], []],
            activateCards: ['death cart'],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testBuy('death cart');
        player.onBuyPhaseStart(() => {
            expect(player.deck.discard.filter((a) => a.types.includes("ruins")).length).to.equal(2);
            done();
        });
        game.start();
    });
    it('self trashes', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['death cart']],
            d
        });
        player.testPlayAction('death cart');
        player.testChooseCard(Texts.trashForBenefit("+$5", 1), 'death cart');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(5);
            expect(player.data.playArea.length).to.equal(0);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'death cart']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'death cart');
        player.testChooseCard(Texts.trashForBenefit("+$5", 1), 'death cart');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(5);
            expect(player.data.playArea.length).to.equal(1);
            done();
        });
        game.start();
    })
});
