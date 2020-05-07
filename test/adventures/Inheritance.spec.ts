import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('INHERITANCE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['estate', 'gold', 'gold', 'copper']],
            activateCards: ['inheritance', 'moneylender'],
            d
        });
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('copper');
        player.testBuy('inheritance');
        player.testGain(Texts.whereWantXToken('estate'), 'moneylender');
        player.testPlayAction('estate');
        player.testChooseCard(Texts.chooseAnAToTrashForB('copper', 'moneylender'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
});
