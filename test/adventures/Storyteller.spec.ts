import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('STORYTELLER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['storyteller', 'copper', 'silver', 'copper', 'copper', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold']],
            d
        });
        player.testPlayAction('storyteller');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'copper');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'silver');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(0);
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'gold', 'gold', 'gold', 'gold', 'gold'])
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'storyteller', 'copper', 'copper', 'copper', 'silver', 'gold', 'silver', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'storyteller');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'copper');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'copper');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'copper');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'silver');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'gold');
        player.testChooseCard(Texts.chooseCardToPlayFor('storyteller'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.money).to.equal(0);
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
