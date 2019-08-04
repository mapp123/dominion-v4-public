import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('COUNTING HOUSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['counting house', 'silver', 'silver', 'silver', 'silver']],
            discards: [['copper', 'copper']],
            d
        });
        player.testPlayAction('counting house');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'copper');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'silver', 'silver', 'copper']);
            expect(player.discardPile).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'counting house', 'silver', 'silver', 'silver']],
            discards: [['copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'counting house');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'copper');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'No Card');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'copper');
        player.testChooseCard(Texts.chooseCardToTakeFromDiscard, 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'silver', 'copper', 'copper']);
            expect(player.discardPile).to.have.members(['copper']);
            done();
        });
        game.start();
    })
});
