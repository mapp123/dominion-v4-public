import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WARRIOR', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['page', 'warrior'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('page');
        player.testPlayAction('warrior');
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['gold']);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('warrior', 'hero'), true);
        player.testConfirm(Texts.doYouWantToExchangeXForY('page', 'treasure hunter'), false);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['hero', 'page']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'warrior'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'warrior');
        player.onBuyPhaseStart(() => {
            expect(q.discardPile).to.have.members(['gold']);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('warrior', 'hero'), true);
        q.onBuyPhaseStart(() => {});
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['hero', 'throne room']);
            done();
        });
        game.start();
    })
});
