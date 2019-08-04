import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ROYAL SEAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['royal seal', 'silver']],
            d
        });
        player.testPlayTreasure('royal seal');
        player.testPlayTreasure('silver');
        player.testBuy('silver');
        player.testHookNextDecision(() => {
            // Give extra buy so we can easily check that the gain went to the correct place
            player.data.buys++;
        });
        player.testOption(Texts.whatToDoWithTheGainedAForB('silver', 'royal seal'), 'Put It On Your Deck');
        player.onBuyPhaseStart(() => {
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['silver']);
            done();
        });
        game.start();
    });
});
