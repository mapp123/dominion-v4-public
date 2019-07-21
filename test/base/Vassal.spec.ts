import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('VASSAL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['vassal', 'copper', 'copper', 'copper', 'copper', 'vassal', 'silver']],
            d
        });
        player.testPlayAction('vassal');
        player.testConfirm(Texts.playCardFromDiscard('vassal'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect(player.data.actions).to.equal(0);
            expect(player.data.money).to.equal(4);
            expect(player.deck.discard.map((a) => a.name)).to.have.members(['silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['vassal', 'throne room', 'copper', 'copper', 'copper', 'vassal', 'silver', 'vassal', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.throneRoomTarget('vassal');
        player.testConfirm(Texts.playCardFromDiscard('vassal'), true);
        player.testConfirm(Texts.playCardFromDiscard('vassal'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
            expect(player.data.actions).to.equal(0);
            expect(player.data.money).to.equal(8);
            expect(player.deck.discard.map((a) => a.name)).to.have.members(['silver', 'silver']);
            done();
        });
        game.start();
    })
});