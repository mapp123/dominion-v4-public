import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ACTING TROUPE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['acting troupe']],
            d
        });
        player.testPlayAction('acting troupe');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['acting troupe']);
            expect(player.data.villagers).to.equal(4);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'acting troupe']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'acting troupe');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['acting troupe']);
            expect(player.data.villagers).to.equal(8);
            done();
        });
        game.start();
    })
});
