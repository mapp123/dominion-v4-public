import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RUINED VILLAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ruined village']],
            d
        });
        player.testPlayAction('ruined village');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ruined village']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ruined village');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
