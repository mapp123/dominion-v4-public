import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HAUNTED WOODS', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['haunted woods', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver'], ['copper', 'copper', 'copper', 'estate', 'estate', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('haunted woods');
        player.endTurn();
        q.testPlayTreasure('copper');
        q.testPlayTreasure('copper');
        q.testPlayTreasure('copper');
        q.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            expect(q.hand).to.have.members(['estate', 'estate', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'haunted woods', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'copper', 'copper'], ['copper', 'copper', 'copper', 'estate', 'estate', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'haunted woods');
        player.endTurn();
        q.testPlayTreasure('copper');
        q.testPlayTreasure('copper');
        q.testPlayTreasure('copper');
        q.testBuy('silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'copper', 'copper']);
            expect(q.hand).to.have.members(['estate', 'estate', 'copper', 'copper', 'copper']);
            done();
        });
        game.start();
    })
});
