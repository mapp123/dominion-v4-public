import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TRAVELLING FAIR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'silver']],
            activateCards: ['travelling fair'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('silver');
        player.testBuy('travelling fair');
        player.testBuy('estate');
        player.testConfirm(Texts.doYouWantToPutTheAOnYourDeck('estate'), true);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['estate']);
            done();
        });
        game.start();
    });
});
