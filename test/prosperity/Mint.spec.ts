import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MINT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mint', 'silver']],
            d
        });
        player.testPlayAction('mint');
        player.testChooseCard(Texts.chooseAToDuplicateWithB('treasure', 'mint'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'mint', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mint');
        player.testChooseCard(Texts.chooseAToDuplicateWithB('treasure', 'mint'), 'silver');
        player.testChooseCard(Texts.chooseAToDuplicateWithB('treasure', 'mint'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver', 'silver']);
            done();
        });
        game.start();
    });
    it('trashes treasures on buy', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'gold'], ['mint']],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('gold');
        player.testBuy('mint');
        player.testPlayAction('mint');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            done();
        });
        game.start();
    })
});
