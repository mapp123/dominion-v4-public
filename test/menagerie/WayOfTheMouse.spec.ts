import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE MOUSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver']],
            activateCards: ['way of the mouse'],
            d,
            params: {'way of the mouse_Target': 'village'}
        });
        player.testPlayWay('way of the mouse', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with duration target', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy']],
            activateCards: ['way of the mouse'],
            d,
            params: {'way of the mouse_Target': 'amulet'}
        });
        player.testPlayWay('way of the mouse', 'smithy');
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            expect(player.data.money).to.equal(1);
        });
        player.testOption(Texts.chooseBenefitFor('amulet'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.playArea).to.have.members(['smithy']);
            expect(player.hand).to.be.empty;
            expect(player.data.money).to.equal(1);
            done();
        })
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'gold']],
            activateCards: ['way of the mouse'],
            d,
            params: {'way of the mouse_Target': 'village'}
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the mouse');
        player.testConfirmWay('way of the mouse');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(4);
            done();
        });
        game.start();
    });
});
