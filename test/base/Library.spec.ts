import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('LIBRARY', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['library', 'copper', 'copper', 'copper', 'copper', 'silver', 'library', 'silver', 'silver']],
            d
        });
        player.testPlayAction('library');
        player.testConfirm(Texts.wantToDraw('library'), false);
        player.onBuyPhaseStart(() => {
            expect(player.hand.length).to.equal(7);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('works - draw action', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['library', 'copper', 'copper', 'copper', 'copper', 'silver', 'library', 'silver', 'silver']],
            d
        });
        player.testPlayAction('library');
        player.testConfirm(Texts.wantToDraw('library'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand.length).to.equal(7);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'library']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'library', 'copper', 'copper', 'copper', 'copper', 'silver', 'library', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'library');
        player.testConfirm(Texts.wantToDraw('library'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand.length).to.equal(7);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'library']);
            done();
        });
        game.start();
    })
});
