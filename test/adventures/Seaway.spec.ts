import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SEAWAY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'gold', 'copper', 'copper', 'copper']],
            activateCards: ['seaway', 'smithy'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('seaway');
        player.testGain('seaway', 'smithy');
        player.testGain(Texts.whereWantXToken('+1 Buy'), 'smithy');
        player.testPlayAction('smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
});
