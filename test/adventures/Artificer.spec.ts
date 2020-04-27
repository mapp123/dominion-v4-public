import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ARTIFICER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['artificer', 'estate', 'estate', 'estate', 'copper', 'silver']],
            d
        });
        player.testPlayAction('artificer');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'No Card');
        player.testGain('artificer', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            expect(player.deck.cards[0].name).to.equal('silver');
            expect(player.discardPile).to.have.members(['estate', 'estate', 'estate']);
            expect(player.hand).to.have.members(['copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'artificer', 'estate', 'estate', 'estate', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'artificer');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'estate');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'No Card');
        player.testGain('artificer', 'silver');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'copper');
        player.testChooseCard(Texts.discardCardsForBenefit('gain a card worth $1 per card discarded'), 'silver');
        player.testGain('artificer', 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(2);
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['estate', 'silver']);
            expect(player.discardPile).to.have.members(['estate', 'estate', 'estate', 'copper', 'silver']);
            expect(player.hand).to.have.members([]);
            done();
        });
        game.start();
    })
});
