import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCOUTING PARTY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'estate', 'silver', 'gold']],
            activateCards: ['scouting party'],
            d
        });
        player.testPlayTreasure('silver');
        player.testBuy('scouting party');
        player.testChooseCard(Texts.chooseCardToDiscardFor('scouting party'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('scouting party'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('scouting party'), 'estate');
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['silver', 'gold']);
            done();
        });
        game.start();
    });
});
