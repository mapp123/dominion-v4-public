import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('SHEEPDOG', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sheepdog', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testPlayAction('sheepdog');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('reacts to gain', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['sheepdog', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']],
            d
        });
        player.testHookNextDecision(() => {
            player.data.buys++;
        });
        player.testPlayAction('No Card');
        player.testBuy('copper');
        player.testConfirm(Texts.doYouWantToPlay('sheepdog'), true);
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'sheepdog', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'sheepdog');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
