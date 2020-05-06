import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PILGRIMAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'gold']],
            activateCards: ['pilgrimage'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('pilgrimage');
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('pilgrimage');
        player.testChooseCard(Texts.chooseCardToGainFor('pilgrimage'), 'silver');
        player.testChooseCard(Texts.chooseCardToGainFor('pilgrimage'), 'gold');
        player.testHookEndTurn(() => {
            expect(player.allCardsTest).to.have.members(['silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    });
});
