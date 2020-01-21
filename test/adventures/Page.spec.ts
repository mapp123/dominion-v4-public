import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PAGE', () => {
    it('recursively activates all cards', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [[]],
            d,
            activateCards: ['page']
        });
        player.onBuyPhaseStart(() => {
            expect(game.supply.getPile('treasure hunter')).to.not.be.null;
            expect(game.supply.getPile('warrior')).to.not.be.null;
            expect(game.supply.getPile('hero')).to.not.be.null;
            expect(game.supply.getPile('champion')).to.not.be.null;
            done();
        });
        game.start();
    });
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['page', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('page');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('page', 'treasure hunter'), true);
        player.optional(() => {
            player.testPlayAction('No Card');
        });
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['treasure hunter', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'page', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'page');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'gold', 'silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('page', 'treasure hunter'), true);
        player.optional(() => {
            player.testPlayAction('No Card');
        });
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['treasure hunter', 'copper', 'copper', 'copper', 'gold', 'silver', 'throne room']);
            done();
        });
        game.start();
    })
});
