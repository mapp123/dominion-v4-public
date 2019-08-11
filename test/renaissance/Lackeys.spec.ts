import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LACKEYS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['lackeys', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('lackeys');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'lackeys', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'lackeys');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    });
    it('adds villagers on gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver'], ['lackeys']],
            d
        });
        player.testPlayTreasure('silver');
        player.testBuy('lackeys');
        player.testHookEndTurn(() => {
            expect(player.data.villagers).to.equal(2);
            done();
        });
        game.start();
    })
});
