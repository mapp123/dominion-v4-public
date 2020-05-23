import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GOATHERD', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['goatherd', 'estate', 'estate', 'estate', 'estate'], ['goatherd', 'estate', 'estate', 'estate', 'estate', 'silver']],
            players: 2,
            d
        });
        player.testPlayAction('goatherd');
        player.testChooseCard(Texts.chooseCardToTrashFor('goatherd'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'estate', 'estate']);
            expect(player.data.actions).to.equal(1);
        });
        q.testPlayAction('goatherd');
        q.testChooseCard(Texts.chooseCardToTrashFor('goatherd'), 'estate');
        q.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['estate', 'estate', 'estate', 'silver']);
            expect(q.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['goatherd', 'estate', 'estate', 'estate', 'estate'], ['throne room', 'goatherd', 'estate', 'estate', 'estate', 'silver', 'gold']],
            players: 2,
            d
        });
        player.testPlayAction('goatherd');
        player.testChooseCard(Texts.chooseCardToTrashFor('goatherd'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['estate', 'estate', 'estate']);
            expect(player.data.actions).to.equal(1);
        });
        q.testPlayAction('throne room');
        q.testChooseCard(Texts.chooseCardToPlayTwice, 'goatherd');
        q.testChooseCard(Texts.chooseCardToTrashFor('goatherd'), 'estate');
        q.testChooseCard(Texts.chooseCardToTrashFor('goatherd'), 'estate');
        q.onBuyPhaseStart(() => {
            expect(q.hand).to.have.members(['estate', 'gold', 'silver']);
            expect(q.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
