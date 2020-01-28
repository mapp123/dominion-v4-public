import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FUGITIVE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['fugitive', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('fugitive');
        player.testChooseCard(Texts.chooseCardToDiscardFor('fugitive'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(1);
            expect(player.discardPile).to.have.members(['copper']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('fugitive', 'disciple'), true);
        player.optional(() => {
            player.testPlayAction('No Card');
        });
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold', 'disciple']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'fugitive', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'fugitive');
        player.testChooseCard(Texts.chooseCardToDiscardFor('fugitive'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('fugitive'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.discardPile).to.have.members(['copper', 'copper']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('fugitive', 'disciple'), true);
        player.optional(() => {
            player.testPlayAction('No Card');
        });
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'disciple', 'throne room']);
            done();
        });
        game.start();
    })
});
