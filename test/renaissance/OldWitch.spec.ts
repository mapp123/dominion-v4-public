import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('OLD WITCH', () => {
    it('works normally', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['old witch', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver'], ['curse']],
            d,
            players: 2
        });
        player.testPlayAction('old witch');
        q.testConfirm(Texts.doYouWantToTrashA('curse'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver']);
            expect(q.discardPile).to.have.members(['curse']);
            expect(game.trash.map((a) => a.name)).to.have.members(['curse']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['throne room', 'old witch', 'copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']],
            d,
            players: 2
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'old witch');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold']);
            expect(q.discardPile).to.have.members(['curse', 'curse']);
            done();
        });
        game.start();
    })
});
