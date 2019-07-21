import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WOODCUTTER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['woodcutter', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('woodcutter');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.data.buys).to.equal(2);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['woodcutter', 'throne room', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.throneRoomTarget('woodcutter');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.data.buys).to.equal(3);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});