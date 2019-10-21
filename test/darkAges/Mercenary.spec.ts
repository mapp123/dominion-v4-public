import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MERCENARY', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['mercenary', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('mercenary');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 2), 'copper');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 1), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('mercenary'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('mercenary'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'gold']);
            expect(player.data.money).to.equal(2);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'mercenary', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'mercenary');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 2), 'copper');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 1), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('mercenary'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('mercenary'), 'copper');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 2), 'copper');
        player.testChooseCard(Texts.trashForBenefit('+2 Cards, +$2', 1), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'gold']);
            expect(player.data.money).to.equal(4);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
