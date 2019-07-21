import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MOAT', () => {
    it('works played', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['moat', 'estate', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('moat');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['moat', 'throne room', 'estate', 'estate', 'copper', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'moat');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'estate', 'copper', 'silver', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('protects against attacks', (d) => {
        const [game, [p, q], done] = makeTestGame({
            players: 2,
            decks: [
                ['attack', 'copper', 'copper', 'copper', 'copper'],
                ['moat', 'estate', 'copper', 'copper', 'copper', 'silver']
            ],
            d
        });
        p.testPlayAction('attack');
        q.testReveal('moat');
        p.onBuyPhaseStart(() => {
            expect(p.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(q.hand).to.have.members(['moat', 'estate', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('allows the choice', (d) => {
        const [game, [p, q], done] = makeTestGame({
            players: 2,
            decks: [
                ['attack', 'copper', 'copper', 'copper', 'copper'],
                ['moat', 'estate', 'copper', 'copper', 'copper', 'silver']
            ],
            d
        });
        p.testPlayAction('attack');
        q.testReveal('moat', false);
        p.onBuyPhaseStart(() => {
            expect(p.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(q.hand).to.have.members(['moat', 'estate', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('only asks once for two moats', (d) => {
        const [game, [p, q], done] = makeTestGame({
            players: 2,
            decks: [
                ['attack', 'copper', 'copper', 'copper', 'copper'],
                ['moat', 'moat', 'copper', 'copper', 'copper', 'silver']
            ],
            d
        });
        p.testPlayAction('attack');
        q.testReveal('moat');
        p.onBuyPhaseStart(() => {
            expect(p.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(q.hand).to.have.members(['moat', 'moat', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});