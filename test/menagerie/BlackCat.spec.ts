import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BLACK CAT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['black cat', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('black cat');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('reacts to gain', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['silver'], ['black cat', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d,
            players: 2
        });
        player.testPlayTreasure('silver');
        player.testBuy('estate');
        q.testConfirm(Texts.doYouWantToPlay('black cat'), true);
        q.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.allCardsTest).to.have.members(['silver', 'estate', 'curse']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'black cat', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'black cat');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
