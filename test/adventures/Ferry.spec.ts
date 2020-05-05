import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FERRY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper']],
            activateCards: ['ferry', 'cellar'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('ferry');
        player.testGain(Texts.whereWantXToken('-$2 cost'), 'cellar');
        player.testBuy('cellar');
        player.testHookEndTurn(() => {
            expect(player.hand).to.have.members(['silver', 'copper', 'cellar']);
            expect(game.getCostOfCard('cellar').coin).to.equal(0);
            done();
        });
        game.start();
    });
});
