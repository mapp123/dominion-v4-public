import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('EXPAND', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['expand', 'silver', 'copper']],
            d
        });
        player.testPlayAction('expand');
        player.testChooseCard(Texts.chooseCardToTrashFor('expand'), 'silver');
        player.testGain(Texts.chooseCardToGainFor('expand'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'expand', 'copper', 'silver', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'expand');
        player.testChooseCard(Texts.chooseCardToTrashFor('expand'), 'copper');
        player.testGain(Texts.chooseCardToGainFor('expand'), 'silver');
        player.testChooseCard(Texts.chooseCardToTrashFor('expand'), 'silver');
        player.testGain(Texts.chooseCardToGainFor('expand'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver', 'gold']);
            done();
        });
        game.start();
    })
});
