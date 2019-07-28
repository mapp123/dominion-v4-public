import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WITCH', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['witch', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver'], []],
            d,
            players: 2
        });
        player.testPlayAction('witch');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(q.discardPile).to.have.members(['curse']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'witch', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold'], []],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'witch');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(q.discardPile).to.have.members(['curse', 'curse']);
            done();
        });
        game.start();
    })
});
