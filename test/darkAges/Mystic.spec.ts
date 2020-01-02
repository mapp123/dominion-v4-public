import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MYSTIC', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mystic', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('mystic');
        player.testChooseCard(Texts.chooseCardToNameFor('mystic'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('works name wrong card', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['mystic', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('mystic');
        player.testChooseCard(Texts.chooseCardToNameFor('mystic'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'mystic', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mystic');
        player.testChooseCard(Texts.chooseCardToNameFor('mystic'), 'silver');
        player.testChooseCard(Texts.chooseCardToNameFor('mystic'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(4);
            done();
        });
        game.start();
    })
});
