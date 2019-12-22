import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import Util from "../../src/Util";

describe('CATACOMBS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['catacombs', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('catacombs');
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['copper', 'silver', 'gold'])), Texts.keepThem);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    });
    it('gains on trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['catacombs', 'chapel', 'copper', 'copper', 'copper']],
            d,
            activateCards: ['smithy']
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'catacombs');
        player.testGain('catacombs', 'smithy');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['smithy']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'catacombs', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'catacombs');
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['copper', 'copper', 'copper'])), Texts.discardThemForBenefit('+3 Cards'));
        player.testOption(Texts.whatToDoWithCards(Util.formatCardList(['gold', 'gold', 'gold'])), Texts.keepThem);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
