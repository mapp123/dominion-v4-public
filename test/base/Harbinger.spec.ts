import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HARBINGER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['harbinger', 'copper', 'copper', 'copper', 'copper', 'silver']],
            discards: [['gold']],
            d
        });
        player.testPlayAction('harbinger');
        player.testChooseCard(Texts.chooseCardToMoveFromDiscardToDeck('harbinger'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            expect(player.data.actions).to.equal(1);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['gold']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['harbinger', 'throne room', 'copper', 'copper', 'copper', 'silver']],
            discards: [['gold', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.throneRoomTarget('harbinger');
        player.testChooseCard(Texts.chooseCardToMoveFromDiscardToDeck('harbinger'), 'gold');
        player.testChooseCard(Texts.chooseCardToMoveFromDiscardToDeck('harbinger'), 'estate');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'gold']);
            expect(player.data.actions).to.equal(2);
            expect(player.deck.cards.map((a) => a.name)).to.have.members(['estate']);
            done();
        });
        game.start();
    })
});