import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BANDIT CAMP', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['bandit camp', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('bandit camp');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.discardPile).to.have.members(['spoils']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'bandit camp', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'bandit camp');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'spoils', 'silver']);
            expect(player.discardPile).to.have.members(['spoils']);
            done();
        });
        game.start();
    })
});
