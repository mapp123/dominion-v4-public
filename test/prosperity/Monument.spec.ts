import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MONUMENT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['monument']],
            d
        });
        player.testPlayAction('monument');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.vp).to.equal(1);
        });
        player.testPlayAction('No Card');
        player.testEndGame();
        player.onScore((score) => {
            expect(score).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'monument']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'monument');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.data.vp).to.equal(2);
            done();
        });
        game.start();
    })
});
