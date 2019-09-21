import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('VILLAIN', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['villain'], ['copper', 'copper', 'copper', 'estate', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('villain');
        q.testChooseCard(Texts.chooseCardToDiscardFor('villain'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(2);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'villain'], ['copper', 'copper', 'copper', 'estate', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'villain');
        q.testChooseCard(Texts.chooseCardToDiscardFor('villain'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.data.coffers).to.equal(4);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
