import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('VAGRANT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['vagrant', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper']],
            d
        });
        player.testPlayAction('vagrant');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'vagrant', 'copper', 'copper', 'copper', 'copper', 'hovel', 'copper', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'vagrant');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'hovel', 'copper']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
