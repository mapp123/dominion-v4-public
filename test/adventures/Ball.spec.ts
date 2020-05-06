import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BALL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'gold']],
            activateCards: ['ball'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('ball');
        player.testGain(Texts.chooseCardToGainFor('ball'), 'silver');
        player.testGain(Texts.chooseCardToGainFor('ball'), 'silver');
        player.testPlayTreasure('silver');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['silver', 'silver', 'silver', 'gold']);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
});
