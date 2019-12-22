import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCAVENGER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['scavenger', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold', 'estate']],
            d
        });
        player.testPlayAction('scavenger');
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.discardPile).to.have.members(['silver', 'estate']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'scavenger', 'copper', 'copper', 'copper', 'silver', 'gold', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'scavenger');
        player.testConfirm(Texts.placeDeckIntoDiscard, true);
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'gold');
        player.testConfirm(Texts.placeDeckIntoDiscard, false);
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.discardPile).to.have.members(['estate']);
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['silver', 'gold']);
            done();
        });
        game.start();
    })
});
