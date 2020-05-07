import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CARGO SHIP', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['cargo ship', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('cargo ship');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.testConfirm(Texts.wouldYouLikeToSetAsideThe('silver', 'cargo ship'), true);
        player.testHookEndTurn(() => {
            expect(player.allCardsTest).to.have.members(['cargo ship', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
        });
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'cargo ship', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'cargo ship');
        player.testHookNextDecision(() => {
            // Give two buys so we can test it twice
            player.data.buys++;
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.testConfirm(Texts.wouldYouLikeToSetAsideThe('silver', 'cargo ship'), true);
        player.testBuy('silver');
        player.testConfirm(Texts.wouldYouLikeToSetAsideThe('silver', 'cargo ship'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
