import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('OVERGROWN ESTATE', () => {
    it('draws on trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['overgrown estate', 'chapel', 'copper', 'copper', 'copper', 'silver']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'overgrown estate');
        player.testHookNextDecision((decision) => {
            expect(decision.decision).to.equal('chooseCard');
            if (decision.decision === 'chooseCard') {
                expect(decision.source.map((a) => a.name)).to.have.members(['copper', 'copper', 'copper', 'silver', 'No Card'])
            }
        });
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['overgrown estate']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
});
