import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HUNTING GROUNDS', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hunting grounds', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver']],
            d
        });
        player.testPlayAction('hunting grounds');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('reacts to trash', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hunting grounds', 'chapel', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'hunting grounds');
        player.testOption(Texts.chooseBenefitFor('hunting grounds'), Texts.gain(['duchy']));
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['duchy']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'hunting grounds', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'hunting grounds');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
