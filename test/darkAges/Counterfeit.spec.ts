import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COUNTERFEIT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['counterfeit', 'copper']],
            d
        });
        player.testPlayTreasure('counterfeit');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
});
