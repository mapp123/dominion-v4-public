import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CROP ROTATION', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'silver', 'copper', 'copper', 'estate', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            activateCards: ['crop rotation'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('crop rotation');
        player.testChooseCard(Texts.discardAForBenefit('victory', 1, 'draw 2 cards'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
});
