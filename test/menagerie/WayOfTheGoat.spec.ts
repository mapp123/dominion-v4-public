import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE GOAT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'silver']],
            activateCards: ['way of the goat'],
            d
        });
        player.testPlayWay('way of the goat', 'smithy');
        player.testChooseCard(Texts.chooseCardToTrashFor('way of the goat'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['smithy', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'silver']],
            activateCards: ['way of the goat'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the goat');
        player.testChooseCard(Texts.chooseCardToTrashFor('way of the goat'), 'copper');
        player.testConfirmWay('way of the goat');
        player.testChooseCard(Texts.chooseCardToTrashFor('way of the goat'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.allCardsTest).to.have.members(['throne room', 'smithy', 'silver']);
            done();
        });
        game.start();
    });
});
