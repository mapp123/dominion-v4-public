import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE OWL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper', 'silver']],
            activateCards: ['way of the owl'],
            d
        });
        player.testPlayWay('way of the owl', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('works with fewer than 6 cards', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['way of the owl'],
            d
        });
        player.testPlayWay('way of the owl', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'copper', 'copper', 'copper']],
            activateCards: ['way of the owl'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the owl');
        player.testHookNextDecision(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
        });
        player.testConfirmWay('way of the owl');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
});
