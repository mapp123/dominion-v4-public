import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import CardRegistry from "../../src/cards/CardRegistry";

describe('TRADE ROUTE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['trade route', 'copper', 'copper', 'copper', 'copper', 'trade route', 'copper']],
            d
        });
        player.testPlayAction('trade route');
        player.testHookNextDecision(() => {
            expect(player.data.money).to.equal(0);
        });
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('estate');
        player.testBuy('copper');
        player.testPlayAction('trade route');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'trade route', 'copper', 'copper', 'silver', 'throne room', 'trade route', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'trade route');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.testHookNextDecision(() => {
            expect(player.data.money).to.equal(0);
        });
        player.testPlayTreasure('silver');
        player.testBuy('estate');
        player.testBuy('copper');
        player.testBuy('copper');
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'trade route');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    });
    it('generates markers', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['trade route', 'copper', 'copper', 'copper', 'copper', 'trade route', 'copper']],
            d
        });
        player.testPlayAction('trade route');
        player.testChooseCard(Texts.chooseCardToTrashFor('trade route'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(CardRegistry.getInstance().getCard('trade route').getSupplyMarkers(game.supply.data.globalCardData['trade route'], [])).to.deep.equal({
                'estate': ['Trade Route Token'],
                'duchy': ['Trade Route Token'],
                'province': ['Trade Route Token'],
                'trade route': ['Value: 0']
            });
            done();
        });
        game.start();
    })
});
