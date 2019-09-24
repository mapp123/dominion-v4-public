import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SINISTER PLOT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'silver']],
            activateCards: ['sinister plot'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('sinister plot');
        player.testOption(Texts.chooseBenefitFor('sinister plot'), Texts.addTokenTo('sinister plot'));
        player.endTurn();
        player.testOption(Texts.chooseBenefitFor('sinister plot'), Texts.addTokenTo('sinister plot'));
        player.endTurn();
        player.testOption(Texts.chooseBenefitFor('sinister plot'), Texts.drawXCards('2'));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
});
