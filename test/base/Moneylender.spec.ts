import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('MONEYLENDER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['moneylender', 'copper', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('moneylender');
        player.testChooseCard(Texts.chooseAnAToTrashForB('copper', 'moneylender'), 'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.data.money).to.equal(3);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'moneylender', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'moneylender');
        player.testChooseCard(Texts.chooseAnAToTrashForB('copper', 'moneylender'),'copper');
        player.testChooseCard(Texts.chooseAnAToTrashForB('copper', 'moneylender'),'copper');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper']);
            expect(player.data.money).to.equal(6);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper', 'copper']);
            done();
        });
        game.start();
    })
});
