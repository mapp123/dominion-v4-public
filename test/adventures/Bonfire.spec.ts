import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BONFIRE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['copper', 'copper', 'copper']],
            activateCards: ['bonfire'],
            d
        });
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testPlayTreasure('copper');
        player.testBuy('bonfire');
        player.testChooseCard(Texts.chooseCardToTrashFor('bonfire'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('bonfire'), 'copper');
        player.testHookEndTurn(() => {
            expect(player.allCardsTest).to.have.members(['copper']);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper', 'copper']);
            done();
        });
        game.start();
    });
});
