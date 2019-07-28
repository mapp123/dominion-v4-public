import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ARTISAN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['artisan', 'copper']],
            d
        });
        player.testPlayAction('artisan');
        player.testGain('artisan', 'silver');
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'artisan', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'artisan');
        player.testGain('artisan', 'silver');
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'silver');
        player.testGain('artisan', 'silver');
        player.testChooseCard(Texts.chooseCardToPutOnDeck, 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.ordered.members(['copper', 'silver']);
            expect(player.hand).to.have.members(['copper', 'silver']);
            done();
        });
        game.start();
    })
});
