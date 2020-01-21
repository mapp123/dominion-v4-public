import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CHAMPION', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['champion', 'smithy', 'copper', 'copper', 'copper', 'silver', 'gold'], ['attack']],
            d,
            players: 2
        });
        player.testPlayAction('champion');
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
        });
        q.testPlayAction('attack');
        q.onBuyPhaseStart(() => {
            expect(player.hand).to.have.length(5);
            if (!player.hand.includes("smithy")) {
                player.draw();
            }
        });
        player.testPlayAction('smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'champion', 'smithy', 'copper', 'copper', 'copper', 'silver', 'gold'], ['attack']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'champion');
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(3);
        });
        q.testPlayAction('attack');
        q.onBuyPhaseStart(() => {
            expect(player.hand).to.have.length(5);
            if (!player.hand.includes("smithy")) {
                player.draw();
            }
        });
        player.testPlayAction('smithy');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            done();
        });
        game.start();
    })
});
