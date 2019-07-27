import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BANDIT', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bandit', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'gold', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('bandit');
        q.testChooseCard(Texts.chooseATreasureToTrashFor('bandit'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['gold']);
            expect(q.discardPile).to.have.members(['gold']);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('works no treasures', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bandit', 'copper', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'estate']],
            d,
            players: 2
        });
        player.testPlayAction('bandit');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['gold']);
            expect(q.discardPile).to.have.members(['copper', 'estate']);
            expect(game.trash.length).to.equal(0);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'bandit', 'copper', 'copper', 'copper'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'bandit');
        q.testChooseCard(Texts.chooseATreasureToTrashFor('bandit'), 'silver');
        q.testChooseCard(Texts.chooseATreasureToTrashFor('bandit'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['gold', 'gold']);
            expect(q.discardPile).to.have.members(['gold', 'silver']);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver', 'gold']);
            done();
        });
        game.start();
    })
});
