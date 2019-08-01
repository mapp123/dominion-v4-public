import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('WATCHTOWER', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['watchtower', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('watchtower');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'watchtower', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'watchtower');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can top deck gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['watchtower', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('No Card');
        player.testBuy('copper');
        player.testOption(Texts.whatToDoWithTheGainedAForB('copper', 'watchtower'), 'Put it on your deck');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    });
    it('can trash an attack gain', (d) => {
        const [game, [player, q], done] = makeTestGame({
            decks: [['witch'], ['watchtower']],
            d,
            players: 2
        });
        player.testPlayAction('witch');
        q.testOption(Texts.whatToDoWithTheGainedAForB('curse', 'watchtower'), 'Trash It');
        player.onBuyPhaseStart(() => {
            expect(q.deck.cards.length).to.equal(0);
            expect(game.trash.map((a) => a.name)).to.have.members(['curse']);
            done();
        });
        game.start();
    });
});
