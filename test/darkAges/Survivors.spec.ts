import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import Util from "../../src/Util";

describe('SURVIVORS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['survivors', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('survivors');
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['copper', 'silver'])), Texts.putThemOnYourDeck);
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'survivors', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'survivors');
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['copper', 'silver'])), Texts.discardThem);
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['gold', 'silver'])), Texts.putThemOnYourDeck);
        player.testReorderSame(Texts.chooseOrderOfCards);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['gold', 'silver']);
            expect(player.discardPile).to.have.members(['copper', 'silver']);
            done();
        });
        game.start();
    })
});
