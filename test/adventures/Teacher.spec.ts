import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TEACHER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['teacher', 'market']],
            d
        });
        player.testPlayAction('teacher');
        player.onBuyPhaseStart(() => {
            expect(player.data.tavernMat.map((a) => a.card.name)).to.have.members(['teacher'])
        });
        player.call('teacher', () => {
            player.testGain(Texts.whereDoYouWantToken, 'market');
            player.testOption(Texts.whichToken, Texts.plusOneAction);
        });
        player.testPlayAction('market');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'teacher']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'teacher');
        player.onBuyPhaseStart(() => {
            expect(player.data.tavernMat.map((a) => a.card.name)).to.have.members(['teacher'])
        });
        player.call('teacher', () => {
            player.testGain(Texts.whereDoYouWantToken, 'throne room');
            player.testOption(Texts.whichToken, Texts.plusOneBuy);
        });
        player.testPlayAction('throne room');
        player.onBuyPhaseStart(() => {
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    })
});
