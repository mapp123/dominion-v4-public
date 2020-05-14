import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WAY OF THE HORSE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['smithy', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            activateCards: ['way of the horse'],
            d
        });
        player.testPlayWay('way of the horse', 'smithy');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(game.supply.getPile('smithy')!.length).to.equal(11);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'smithy', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            activateCards: ['way of the horse'],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'smithy');
        player.testConfirmWay('way of the horse');
        player.testConfirmWay('way of the horse');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(game.supply.getPile('smithy')!.length).to.equal(11);
            done();
        });
        game.start();
    });
});
