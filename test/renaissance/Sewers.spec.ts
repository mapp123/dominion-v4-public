import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SEWERS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper', 'copper', 'copper', 'copper', 'smithy', 'chapel', 'copper', 'copper', 'copper', 'copper', 'gold', 'silver']],
            activateCards: ['sewers'],
            d
        });
        player.testPlayTreasure('silver');
        player.testPlayTreasure('copper');
        player.testBuy('sewers');
        player.testHookNextDecision(() => {
            player.data.actions++;
        });
        player.testPlayAction('smithy');
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('sewers'), 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('sewers'), 'gold');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('sewers'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members([]);
            done();
        });
        game.start();
    });
});
