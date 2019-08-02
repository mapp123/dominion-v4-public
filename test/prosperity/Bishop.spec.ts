import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BISHOP', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['bishop', 'silver', 'copper', 'copper', 'copper'], ['copper']],
            d,
            players: 2
        });
        player.testPlayAction('bishop');
        player.testChooseCard(Texts.chooseCardToTrashFor('bishop'), 'silver');
        q.testChooseCard(Texts.chooseCardToTrashFor('bishop'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.vp).to.equal(2);
            expect(q.hand.length).to.equal(0);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'bishop', 'silver', 'silver', 'copper'], ['copper']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'bishop');
        player.testChooseCard(Texts.chooseCardToTrashFor('bishop'), 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('bishop'), 'silver');
        q.testChooseCard(Texts.chooseCardToTrashFor('bishop'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.data.vp).to.equal(4);
            expect(q.hand.length).to.equal(0);
            expect(game.trash.map((a) => a.name)).to.have.members(['silver', 'silver', 'copper']);
            done();
        });
        game.start();
    })
});
