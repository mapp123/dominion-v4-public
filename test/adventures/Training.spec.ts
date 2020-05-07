import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TRAINING', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold', 'festival']],
            activateCards: ['training'],
            d
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('training');
        player.testGain(Texts.whereWantXToken('+$1'), 'festival');
        player.testPlayAction('festival');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
});
