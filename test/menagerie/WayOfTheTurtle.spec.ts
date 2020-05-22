import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE TURTLE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'gold']],
            activateCards: ['way of the turtle'],
            d
        });
        player.testPlayWay('way of the turtle', 'smithy');
        player.endTurn();
        player.testConfirmWay('smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'gold', 'gold', 'gold']],
            activateCards: ['way of the turtle'],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('smithy');
        player.testConfirmWay('way of the turtle');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
        });
        player.testConfirmWay('smithy');
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['throne room', 'copper', 'copper', 'copper', 'copper', 'gold', 'gold', 'gold']);
            done();
        });
        game.start();
    });
});
