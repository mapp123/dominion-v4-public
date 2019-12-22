import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MARKET SQUARE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['market square', 'copper', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('market square');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.buys).to.equal(2);
            done();
        });
        game.start();
    });
    it('reacts to trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['market square', 'chapel', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testConfirm(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold'), true);
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver']);
            expect(player.discardPile).to.have.members(['gold', 'market square']);
            done();
        });
        game.start();
    });
    it('allows decline from trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['market square', 'chapel', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testConfirm(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold'), false);
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testConfirm(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold'), false);
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['market square', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'market square', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'market square');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.buys).to.equal(3);
            done();
        });
        game.start();
    })
});
