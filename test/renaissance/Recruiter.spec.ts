import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('RECRUITER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['recruiter', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('recruiter');
        player.testChooseCard(Texts.chooseCardToTrashFor('recruiter'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'gold']);
            expect(player.data.villagers).to.equal(3);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'recruiter', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'recruiter');
        player.testChooseCard(Texts.chooseCardToTrashFor('recruiter'), 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('recruiter'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.villagers).to.equal(9);
            done();
        });
        game.start();
    });
});
