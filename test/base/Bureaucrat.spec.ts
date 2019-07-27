import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BUREAUCRAT', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bureaucrat', 'copper', 'copper', 'copper', 'copper'], ['estate', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('bureaucrat');
        q.testChooseCard(Texts.chooseVictoryToTopDeckFor('bureaucrat'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(q.deck.cards.map((a) => a.name)).to.have.members(['estate']);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bureaucrat', 'throne room', 'copper', 'copper', 'copper'], ['estate', 'duchy', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.throneRoomTarget('bureaucrat');
        q.testChooseCard(Texts.chooseVictoryToTopDeckFor('bureaucrat'), 'estate');
        q.testChooseCard(Texts.chooseVictoryToTopDeckFor('bureaucrat'), 'duchy');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver', 'silver']);
            expect(q.deck.cards.map((a) => a.name)).to.have.ordered.members(['duchy', 'estate']);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});