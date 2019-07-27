import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COUNCIL ROOM', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['council room', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('council room');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.buys).to.equal(2);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'council room', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'silver', 'silver', 'gold', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'council room');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.buys).to.equal(3);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    })
});
