import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CATHEDRAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper']],
            activateCards: ['cathedral'],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('cathedral');
        player.testChooseCard(Texts.chooseCardToTrashFor('cathedral'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('warns', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'silver']],
            activateCards: ['cathedral'],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('silver');
        player.testBuy('cathedral');
        player.testChooseCard(Texts.chooseCardToTrashFor('cathedral'), 'silver');
        player.testConfirm(Texts.areYouSureYouWantToTrash('silver'), false);
        player.testChooseCard(Texts.chooseCardToTrashFor('cathedral'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
});
