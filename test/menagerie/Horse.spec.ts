import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HORSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['horse', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold']],
            d
        });
        player.testPlayAction('horse');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.allCardsTest).to.not.contain('horse');
            expect(game.supply.getPile('horse')!.length).to.equal(31);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'horse', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'horse');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.allCardsTest).to.not.contain('horse');
            expect(game.supply.getPile('horse')!.length).to.equal(31);
            done();
        });
        game.start();
    })
});
