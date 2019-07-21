import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('VILLAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['village', 'estate', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'village', 'estate', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'silver', 'estate']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    })
});