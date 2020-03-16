import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('DUNGEON', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['dungeon', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold']],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('dungeon');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'silver']);
        });
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'silver', 'silver', 'gold']);
            expect(player.playArea).to.have.members(['dungeon']);
        });
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'dungeon', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'silver']],
            d
        });
        player.deck.shouldShuffle = false;
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'dungeon');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'gold', 'gold']);
        });
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'copper');
        player.testChooseCard(Texts.chooseCardToDiscardFor('dungeon'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['silver', 'silver', 'gold', 'gold', 'copper']);
            expect(player.playArea).to.have.members(['dungeon', 'throne room']);
            done();
        });
        game.start();
    })
});
