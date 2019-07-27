import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LABORATORY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['laboratory', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold', 'estate']],
            d
        });
        player.testPlayAction('laboratory');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'laboratory', 'copper', 'copper', 'copper', 'silver', 'gold', 'silver', 'gold', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'laboratory');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
