import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RUINED LIBRARY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['ruined library', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('ruined library');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'ruined library', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'ruined library');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            done();
        });
        game.start();
    })
});
