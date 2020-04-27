import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GIANT', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['giant'], ['copper', 'copper', 'copper', 'copper', 'silver', 'copper']],
            d,
            players: 2
        });
        q.deck.shouldShuffle = false;
        player.testPlayAction('giant');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.tokens.journeyToken).to.equal('DOWN');
        });
        q.endTurn();
        player.testPlayAction('giant');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(5);
            done();
        })
        game.start();
    });
    it('works with curse', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['giant'], ['copper', 'copper', 'copper', 'copper', 'province', 'copper']],
            d,
            players: 2
        });
        q.deck.shouldShuffle = false;
        player.testPlayAction('giant');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.tokens.journeyToken).to.equal('DOWN');
        });
        q.endTurn();
        player.testPlayAction('giant');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members([]);
            expect(q.discardPile).to.have.members(['province', 'curse']);
            expect(player.data.money).to.equal(5);
            done();
        })
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'giant'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'giant');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.money).to.equal(6);
            expect(player.data.tokens.journeyToken).to.equal('UP');
            done();
        });
        game.start();
    })
});
