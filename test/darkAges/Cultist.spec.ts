import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import type Card from "../../src/cards/Card";

describe('CULTIST', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['cultist', 'cultist', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold'], []],
            d,
            players: 2
        });
        player.testPlayAction('cultist');
        player.testConfirm(Texts.playCardFromHand('cultist'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(q.discardPile).to.have.length(2);
            expect(q.deck.discard[0].types).to.include('ruins');
            expect(q.deck.discard[1].types).to.include('ruins');
            done();
        });
        game.start();
    });
    it('responds to trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chapel', 'cultist', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold'], []],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'cultist');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'cultist', 'cultist', 'cultist', 'copper', 'silver', 'silver', 'gold', 'gold', 'silver', 'silver', 'gold', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'cultist');
        player.testConfirm(Texts.playCardFromHand('cultist'), true);
        player.testConfirm(Texts.playCardFromHand('cultist'), false);
        player.testConfirm(Texts.playCardFromHand('cultist'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver', 'gold', 'gold', 'silver', 'silver', 'gold', 'gold']);
            expect(q.discardPile).to.have.length(4);
            expect(q.deck.discard).to.satisfy((discard: Card[]) => {
                return discard.every((card) => card.types.includes('ruins'));
            });
            done();
        });
        game.start();
    })
});
