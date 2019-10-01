import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RUINS', () => {
    it('builds a pile', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [[], []],
            d,
            players: 2,
            activateCards: ['ruins']
        });
        player.onBuyPhaseStart(() => {
            expect(game.supply.getPile('ruins')!.length).to.equal(10);
            console.log(game.supply.getPile('ruins')!.map((a) => a.name));
            done();
        });
        game.start();
    });
});
