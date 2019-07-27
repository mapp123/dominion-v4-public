import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MARKET', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['market', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('market');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'market', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'market');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(3);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    })
});
