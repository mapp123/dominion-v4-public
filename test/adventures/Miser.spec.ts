import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MISER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['miser', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('miser');
        player.testOption(Texts.chooseBenefitFor('miser'), Texts.putXOnTavernMap('copper from your hand'));
        player.onBuyPhaseStart(() => {
            expect(player.data.tavernMat[0].card.name).to.equal('copper');
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'miser', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'miser');
        player.testOption(Texts.chooseBenefitFor('miser'), Texts.putXOnTavernMap('copper from your hand'));
        player.testOption(Texts.chooseBenefitFor('miser'), Texts.extraMoney('1'));
        player.onBuyPhaseStart(() => {
            expect(player.data.tavernMat[0].card.name).to.equal('copper');
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    })
});
