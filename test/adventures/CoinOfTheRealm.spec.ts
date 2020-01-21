import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COIN OF THE REALM', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['coin of the realm', 'copper', 'copper', 'copper', 'copper', 'smithy', 'smithy']],
            d
        });
        player.testPlayTreasure('coin of the realm');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
        });
        player.testPlayAction('smithy');
        player.testConfirm(Texts.doYouWantToCall('coin of the realm'), true);
        player.testPlayAction('smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
});
