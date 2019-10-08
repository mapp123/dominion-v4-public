import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('STOREROOM', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['storeroom', 'copper', 'copper', 'estate', 'estate', 'silver', 'estate']],
            d
        });
        player.testPlayAction('storeroom');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'No Card');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver']);
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'storeroom', 'copper', 'estate', 'estate', 'silver', 'estate', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'storeroom');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'No Card');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'No Card');
        // Hand at this point is ['copper', 'silver'], deck is ['estate']
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'copper');
        player.testChooseCard(Texts.discardForBenefit(Texts.drawXCards("1"), 1), 'No Card');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'estate');
        player.testChooseCard(Texts.discardForBenefit(Texts.extraMoney("1"), 1), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver']);
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    })
});
