import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TRADE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'gold', 'estate', 'duchy']],
            activateCards: ['trade'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('trade');
        player.testChooseCard(Texts.trashForBenefit(Texts.gain(['silver']), 1), 'estate');
        player.testChooseCard(Texts.trashForBenefit(Texts.gain(['silver']), 1), 'duchy');
        player.testHookEndTurn(() => {
            expect(player.allCardsTest).to.have.members(['silver', 'gold', 'silver', 'silver']);
            done();
        });
        game.start();
    });
});
