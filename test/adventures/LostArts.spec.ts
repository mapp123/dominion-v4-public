import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LOST ARTS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold', 'festival']],
            activateCards: ['lost arts', 'festival'],
            d
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('lost arts');
        player.testGain(Texts.whereWantXToken('+1 Action'), 'festival');
        player.testPlayAction('festival');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(3);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
});
