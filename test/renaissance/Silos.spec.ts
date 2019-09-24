import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SILOS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold']],
            activateCards: ['silos'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('silos');
        player.testConfirm(Texts.doYouWantToDiscardAnAForB('copper', 'silos'), true);
        player.testConfirm(Texts.doYouWantToDiscardAnAForB('copper', 'silos'), false);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver', 'silver', 'gold']);
            done();
        });
        game.start();
    });
});
