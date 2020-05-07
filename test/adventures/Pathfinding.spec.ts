import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PATHFINDING', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold', 'silver', 'copper', 'moneylender', 'copper', 'moneylender']],
            activateCards: ['pathfinding'],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('silver');
        player.testBuy('pathfinding');
        player.testGain(Texts.whereWantXToken('+1 Card'), 'moneylender');
        player.testPlayAction('moneylender');
        player.testChooseCard(Texts.chooseAnAToTrashForB('copper', 'moneylender'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['gold', 'gold', 'silver', 'copper']);
            done();
        });
        game.start();
    });
});
