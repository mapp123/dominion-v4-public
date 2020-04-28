import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ROYAL CARRIAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['royal carriage', 'festival']],
            d
        });
        player.testPlayAction('royal carriage');
        player.testPlayAction('festival');
        player.testConfirm(Texts.doYouWantToCall('royal carriage'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'royal carriage', 'festival']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'royal carriage');
        // Don't duplicate Throne Room
        player.testConfirm(Texts.doYouWantToCall('royal carriage'), false);
        player.testPlayAction('festival');
        player.testConfirm(Texts.doYouWantToCall('royal carriage'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(5);
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
