import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GOONS', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['goons', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('goons');
        q.testChooseCard(Texts.chooseCardToDiscardFor('goons'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('goons'), 'copper');
        player.testPlayTreasure('copper');
        player.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.vp).to.equal(1);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'goons'], ['copper', 'copper', 'copper', 'copper', 'copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'goons');
        q.testChooseCard(Texts.chooseCardToDiscardFor('goons'), 'copper');
        q.testChooseCard(Texts.chooseCardToDiscardFor('goons'), 'copper');
        player.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            expect(q.hand).to.have.members(['copper', 'copper', 'copper']);
            // Throne Room does not duplicate the in-play effects
            // http://wiki.dominionstrategy.com/index.php/Goons#Official_FAQ
            expect(player.data.vp).to.equal(1);
            done();
        });
        game.start();
    })
});
