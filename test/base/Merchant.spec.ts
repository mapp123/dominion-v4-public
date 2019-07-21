import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MERCHANT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['merchant', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('merchant');
        player.testPlayTreasure('silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'gold']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['merchant', 'throne room', 'copper', 'copper', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.throneRoomTarget('merchant');
        player.testPlayTreasure('silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'gold', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});