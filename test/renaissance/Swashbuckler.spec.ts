import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SWASHBUCKLER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['swashbuckler', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']],
            discards: [['copper']],
            d
        });
        player.testPlayAction('swashbuckler');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            expect(player.data.coffers).to.equal(1);
            done();
        });
        game.start();
    });
    it('works with three coffers', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['swashbuckler', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']],
            discards: [['copper']],
            d
        });
        player.testHookNextDecision(() => {
            player.data.coffers += 3;
        });
        player.testPlayAction('swashbuckler');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            expect(player.data.coffers).to.equal(4);
            expect(player.discardPile).to.have.members(['copper', 'gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'swashbuckler', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']],
            discards: [['copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'swashbuckler');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']);
            expect(player.data.coffers).to.equal(2);
            expect(player.discardPile).to.have.members(['copper']);
            done();
        });
        game.start();
    })
});
