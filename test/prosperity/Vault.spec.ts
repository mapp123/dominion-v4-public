import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('VAULT', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['vault', 'copper', 'silver', 'copper', 'copper', 'gold', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('vault');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'copper');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'No Card');
        q.testChooseCard(Texts.discardForBenefit('to draw a card', 2), 'copper');
        q.testChooseCard(Texts.discardForBenefit('to draw a card'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'copper', 'copper', 'gold', 'gold']);
            expect(player.data.money).to.equal(1);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'vault', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'vault');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'copper');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'No Card');
        q.testChooseCard(Texts.discardForBenefit('to draw a card', 2), 'copper');
        q.testChooseCard(Texts.discardForBenefit('to draw a card'), 'copper');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'copper');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'copper');
        player.testChooseCard(Texts.discardForBenefit('+1 Money'), 'No Card');
        q.testChooseCard(Texts.discardForBenefit('to draw a card', 2), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'gold', 'gold']);
            expect(player.data.money).to.equal(3);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    })
});
