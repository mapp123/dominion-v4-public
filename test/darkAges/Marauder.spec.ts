import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MARAUDER', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['marauder'], []],
            d,
            players: 2
        });
        player.testPlayAction('marauder');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['spoils']);
            expect(q.deck.discard[0].types).to.include('ruins');
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'marauder'], []],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'marauder');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['spoils', 'spoils']);
            expect(q.deck.discard).to.satisfy(function(arr) {
                return arr.every((card) => card.types.includes('ruins'));
            });
            done();
        });
        game.start();
    })
});
