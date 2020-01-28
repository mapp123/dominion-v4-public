import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PEASANT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['peasant']],
            d
        });
        player.testPlayAction('peasant');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(1);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('peasant', 'soldier'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['soldier']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'peasant']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'peasant');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(2);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('peasant', 'soldier'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['soldier', 'throne room']);
            done();
        });
        game.start();
    })
});
