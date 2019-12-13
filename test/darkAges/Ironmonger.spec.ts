import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('IRONMONGER', () => {
    it('works normally with action', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ironmonger', 'copper', 'copper', 'copper', 'copper', 'copper', 'ironmonger']],
            d
        });
        player.testPlayAction('ironmonger');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'ironmonger'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('works normally with treasure', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ironmonger', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('ironmonger');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'copper'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('works normally with victory', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ironmonger', 'copper', 'copper', 'copper', 'copper', 'copper', 'estate', 'silver']],
            d
        });
        player.testPlayAction('ironmonger');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'estate'), true);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ironmonger', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ironmonger');
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'silver'), false);
        player.testConfirm(Texts.shouldADiscardTheBOnTopOfTheirDeck('you', 'gold'), false);
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['gold']);
            done();
        });
        game.start();
    })
});
