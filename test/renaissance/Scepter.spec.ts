import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SCEPTER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['village', 'market', 'scepter', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('village');
        player.testPlayAction('market');
        player.testPlayTreasure('scepter');
        player.testOption(Texts.chooseBenefitFor('scepter'), Texts.replayAction);
        player.testChooseCard(Texts.chooseCardToReplay, 'village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(4);
            expect(player.data.money).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('works with +2 money', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['scepter', 'copper', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayTreasure('scepter');
        player.testOption(Texts.chooseBenefitFor('scepter'), Texts.extraMoney("2"));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(2);
            done();
        });
        game.start();
    });
});
