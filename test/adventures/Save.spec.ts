import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SAVE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'gold', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['save'],
            d
        });
        player.testPlayTreasure('copper')
        player.testBuy('save');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('save'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(1);
        });
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['gold', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
