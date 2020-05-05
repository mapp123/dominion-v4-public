import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PLAN', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gold', 'copper']],
            activateCards: ['plan', 'cellar'],
            d
        });
        player.testPlayTreasure('gold');
        player.testBuy('plan');
        player.testGain(Texts.whereWantXToken('trashing'), 'cellar');
        player.testPlayTreasure('gold');
        player.testBuy('cellar');
        player.testChooseCard(Texts.chooseCardToTrashFor('plan'), 'copper');
        player.testHookEndTurn(() => {
            expect(player.allCardsTest).to.have.members(['gold', 'cellar']);
            done();
        });
        game.start();
    });
});
