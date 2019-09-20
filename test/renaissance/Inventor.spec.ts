import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('INVENTOR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['inventor']],
            d
        });
        player.testPlayAction('inventor');
        player.testGain('inventor', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver']);
            expect(game.getCostOfCard('silver')).to.deep.equal({
                coin: 2
            });
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'inventor']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'inventor');
        player.testGain('inventor', 'silver');
        player.testHookNextDecision(() => {
            expect(game.getCostOfCard('silver')).to.deep.equal({
                coin: 2
            });
        });
        player.testGain('inventor', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver', 'silver']);
            expect(game.getCostOfCard('silver')).to.deep.equal({
                coin: 1
            });
            done();
        });
        game.start();
    })
});
