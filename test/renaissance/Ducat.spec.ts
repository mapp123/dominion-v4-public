import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DUCAT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ducat']],
            d
        });
        player.testPlayTreasure('ducat');
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can trash on gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper'], ['ducat']],
            d
        });
        player.testPlayTreasure('silver');
        player.testBuy('ducat');
        player.testConfirm(Texts.doYouWantToTrashA('copper'), true);
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
});
