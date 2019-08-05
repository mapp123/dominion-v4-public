import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PEDDLER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['peddler', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('peddler');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('self modifies based on number of actions', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['attack'], ['peddler']],
            d
        });
        player.testPlayAction('attack');
        player.onBuyPhaseStart(() => {
            expect(game.getCostOfCard('peddler')).to.deep.equal({
                coin: 6
            });
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'peddler', 'copper', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'peddler');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'gold', 'silver']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
});
