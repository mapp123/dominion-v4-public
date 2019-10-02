import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HOVEL', () => {
    it('is trashed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hovel', 'silver']],
            d
        });
        player.testPlayTreasure('silver');
        player.testBuy('estate');
        player.testConfirm(Texts.doYouWantToTrashA('hovel'), true);
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['hovel']);
            done();
        });
        game.start();
    });
});
