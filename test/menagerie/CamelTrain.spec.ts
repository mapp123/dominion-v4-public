import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CAMEL TRAIN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['camel train']],
            d
        });
        player.testPlayAction('camel train');
        player.testGain(Texts.chooseCardToExileFor('camel train'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.exile).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('reacts to gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'gold']],
            activateCards: ['camel train'],
            d
        });
        player.testPlayTreasure('gold');
        player.testBuy('camel train');
        player.testHookNextDecision(() => {
            expect(player.exile).to.have.members(['gold']);
        });
        player.testPlayAction('No Card');
        player.testPlayTreasure('gold');
        player.testPlayTreasure('gold');
        player.testBuy('gold');
        player.testConfirm(Texts.wantDiscardFromExile('gold'), true);
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['gold', 'gold', 'gold', 'gold', 'camel train']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'camel train']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'camel train');
        player.testGain(Texts.chooseCardToExileFor('camel train'), 'gold');
        player.testGain(Texts.chooseCardToExileFor('camel train'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.exile).to.have.members(['gold', 'gold']);
            done();
        });
        game.start();
    })
});
