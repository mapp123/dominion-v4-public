import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WORKER\'S VILLAGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['worker\'s village', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('worker\'s village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'worker\'s village', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'worker\'s village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(4);
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    })
});
