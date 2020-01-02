import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('JUNK DEALER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['junk dealer', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('junk dealer');
        player.testChooseCard(Texts.chooseCardToTrashFor('junk dealer'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            expect(player.data.money).to.equal(1);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'junk dealer', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'junk dealer');
        player.testChooseCard(Texts.chooseCardToTrashFor('junk dealer'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('junk dealer'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'gold', 'silver']);
            expect(player.data.money).to.equal(2);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
