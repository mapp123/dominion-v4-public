import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RANGER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ranger', 'copper', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('ranger');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            // Assert no draw
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.data.tokens.journeyToken).to.equal('DOWN');
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ranger', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ranger');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(3);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver']);
            expect(player.data.tokens.journeyToken).to.equal('UP');
            done();
        });
        game.start();
    })
});
