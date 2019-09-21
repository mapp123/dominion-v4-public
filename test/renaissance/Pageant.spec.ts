import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PAGEANT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver']],
            activateCards: ['pageant'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('pageant');
        player.testConfirm(Texts.wantBuyCoffers, true);
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(1);
            done();
        });
        game.start();
    });
});
