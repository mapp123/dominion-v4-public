import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SPY', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['spy', 'copper', 'copper', 'copper', 'copper', 'gold', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('spy');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'silver'), false);
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck(q.username, 'gold'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'gold']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(q.discardPile).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'spy', 'copper', 'copper', 'copper', 'silver', 'gold', 'silver'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'spy');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'gold'), false);
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck(q.username, 'silver'), true);
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'silver'), false);
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck(q.username, 'gold'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(q.discardPile).to.have.members(['gold', 'silver']);
            done();
        });
        game.start();
    })
});
