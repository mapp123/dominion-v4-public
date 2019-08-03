import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COUNTING HOUSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['counting house']],
            d
        });
        player.testPlayAction('counting house');
        player.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'counting house']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'counting house');
        player.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    })
});
