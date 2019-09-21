import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CITY GATE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper']],
            activateCards: ['city gate'],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('city gate');
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
});
