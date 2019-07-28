import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ADVENTURER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['adventurer', 'copper', 'copper', 'copper', 'copper', 'estate', 'silver', 'silver']],
            d
        });
        player.testPlayAction('adventurer');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.discardPile).to.have.members(['estate']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'adventurer', 'copper', 'copper', 'copper', 'estate', 'silver', 'gold', 'duchy', 'duchy', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'adventurer');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold', 'gold', 'gold']);
            expect(player.discardPile).to.have.members(['estate', 'duchy', 'duchy']);
            done();
        });
        game.start();
    })
});
