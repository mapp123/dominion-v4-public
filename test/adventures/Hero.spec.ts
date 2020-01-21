import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HERO', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hero']],
            d
        });
        player.testPlayAction('hero');
        player.testGain('hero', 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.discardPile).to.have.members(['gold']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('hero', 'champion'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['champion', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'hero']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'hero');
        player.testGain('hero', 'gold');
        player.testGain('hero', 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(4);
            expect(player.discardPile).to.have.members(['gold', 'gold']);
        });
        player.testConfirm(Texts.doYouWantToExchangeXForY('hero', 'champion'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.allCards.map((a) => a.name)).to.have.members(['champion', 'gold', 'gold', 'throne room']);
            done();
        });
        game.start();
    })
});
