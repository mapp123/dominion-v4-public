import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('TREASURER', () => {
    it('works with trash treasure', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['treasurer', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('treasurer');
        player.testOption(Texts.chooseBenefitFor('treasurer'), Texts.trashA('treasure'));
        player.testChooseCard(Texts.chooseATreasureToTrashFor('treasurer'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('works with take key', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['treasurer']],
            d
        });
        player.testPlayAction('treasurer');
        player.testOption(Texts.chooseBenefitFor('treasurer'), Texts.takeArtifact('key'));
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(3);
        });
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'treasurer', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'treasurer');
        player.testOption(Texts.chooseBenefitFor('treasurer'), Texts.trashA('treasure'));
        player.testChooseCard(Texts.chooseATreasureToTrashFor('treasurer'), 'copper');
        player.testOption(Texts.chooseBenefitFor('treasurer'), Texts.gainAFromB('treasure', 'the trash'));
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.data.money).to.equal(6);
            done();
        });
        game.start();
    })
});
