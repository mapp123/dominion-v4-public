import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('STAR CHART', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['star chart'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('star chart');
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand[0]).to.equal('silver');
            done();
        });
        player.optional(() => {
            player.testChooseCard(Texts.chooseCardToPutOnDeck, 'silver');
        });
        game.start();
    });
});
