import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('PROCESSION', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['procession', 'village', 'copper', 'copper', 'copper', 'silver', 'gold']],
            activateCards: ['smithy'],
            d
        });
        player.testPlayAction('procession');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'village');
        player.testGain('procession', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(4);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.discardPile).to.have.members(['smithy']);
            expect(game.trash.map((a) => a.name)).to.have.members(['village']);
            done();
        });
        game.start();
    });
});
