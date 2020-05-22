import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE SEAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the seal'],
            d
        });
        player.testPlayWay('way of the seal', 'smithy');
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testBuy('copper');
        player.testConfirm(Texts.doYouWantToPutTheAOnYourDeck('copper'), true);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the seal'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the seal');
        player.testConfirmWay('way of the seal');
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testBuy('estate');
        player.testConfirm(Texts.doYouWantToPutTheAOnYourDeck('estate'), true);
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['estate']);
            done();
        });
        game.start();
    });
});
