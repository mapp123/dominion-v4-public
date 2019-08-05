import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import CardRegistry from "../../src/cards/CardRegistry";

describe('CONTRABAND', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['contraband'], []],
            d,
            players: 2
        });
        player.testPlayTreasure('contraband');
        q.testGain(Texts.chooseACardThatACannotBuyThisTurn(player.username), 'silver');
        player.testHookNextDecision((decision) => {
            expect(decision.decision).to.equal('buy');
            expect((decision as any).gainRestrictions.allowedCards).to.not.contain('silver');
        });
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            done();
        });
        game.start();
    });
    it('generates markers', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['contraband']],
            d,
            players: 2
        });
        player.testPlayTreasure('contraband');
        q.testGain(Texts.chooseACardThatACannotBuyThisTurn(player.username), 'silver');
        player.onBuyPhaseStart(() => {
            expect(CardRegistry.getInstance().getCard('contraband').getSupplyMarkers(game.supply.data.globalCardData['contraband'], [])).to.deep.equal({
                'silver': ['Banned (Contraband)']
            });
            done();
        });
        game.start();
    });
});
