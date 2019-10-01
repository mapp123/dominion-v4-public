import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RUINED MARKET', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ruined market']],
            d
        });
        player.testPlayAction('ruined market');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ruined market']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ruined market');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    })
});
