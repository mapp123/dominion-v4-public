import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DUPLICATE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['duplicate', 'copper', 'copper', 'copper']],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('duplicate');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.testConfirm(Texts.doYouWantToCallXForY('duplicate', 'gain a silver'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'copper', 'copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['duplicate']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'duplicate', 'copper', 'copper', 'copper']],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'duplicate');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.testConfirm(Texts.doYouWantToCallXForY('duplicate', 'gain a silver'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'throne room', 'copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['duplicate', 'copper']);
            done();
        });
        game.start();
    })
});
