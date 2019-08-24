import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('EXPERIMENT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['experiment', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('experiment');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.data.playArea.length).to.equal(0);
            expect(game.supply.getPile('experiment')!.length).to.equal(11);
            done();
        });
        game.start();
    });
    it('self duplicates', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['silver', 'copper', 'copper', 'copper', 'copper'], ['experiment']],
            d
        });
        player.testHookNextDecision(() => player.data.buys++);
        player.testPlayTreasure('copper');
        player.testPlayTreasure('silver');
        player.testBuy('experiment');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['experiment', 'experiment']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'experiment', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'experiment');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.data.playArea.map((a) => a.name)).to.have.members(['throne room']);
            expect(game.supply.getPile('experiment')!.length).to.equal(11);
            done();
        });
        game.start();
    })
});
