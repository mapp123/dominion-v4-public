import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCHOLAR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['scholar', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('scholar');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'scholar', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'estate', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'scholar');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['gold', 'gold', 'gold', 'gold', 'gold', 'estate', 'estate']);
            done();
        });
        game.start();
    })
});
