import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('BAND OF MISFITS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['band of misfits', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']],
            d,
            activateCards: ['smithy']
        });
        player.testPlayAction('band of misfits');
        player.testGain(Texts.chooseCardFromSupplyToPlay, 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            expect(player.discardPile).to.be.empty;
            expect(player.deck.cards).to.be.empty;
            expect(game.supply.getPile('smithy')).to.have.length(10);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['band of misfits', 'throne room', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold']],
            d,
            activateCards: ['smithy', 'village']
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'band of misfits');
        player.testGain(Texts.chooseCardFromSupplyToPlay, 'smithy');
        player.testGain(Texts.chooseCardFromSupplyToPlay, 'village');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.discardPile).to.be.empty;
            expect(player.deck.cards).to.be.empty;
            expect(game.supply.getPile('smithy')).to.have.length(10);
            expect(game.supply.getPile('village')).to.have.length(10);
            done();
        });
        game.start();
    })
});
