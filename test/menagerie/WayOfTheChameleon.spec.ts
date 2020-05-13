import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE CHAMELEON', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayWay('way of the chameleon', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
    it('works with village', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['village']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayWay('way of the chameleon', 'village');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with woodcutter', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['woodcutter', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayWay('way of the chameleon', 'woodcutter');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('doesn\'t touch cellar', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['cellar', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayWay('way of the chameleon', 'cellar');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('cellar'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with throne room', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'village', 'copper', 'copper', 'copper', 'silver', 'gold']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayWay('way of the chameleon', 'throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'village');
        player.testOption(Texts.chooseAnXEffectToRunNext('on play'), 'village');
        player.testOption(Texts.chooseAnXEffectToRunNext('on play'), 'village');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(0);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy']],
            activateCards: ['way of the chameleon'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the chameleon');
        player.testConfirmWay('way of the chameleon');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(6);
            done();
        });
        game.start();
    });
});
