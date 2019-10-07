import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('HERMIT', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['hermit', 'copper', 'copper', 'copper', 'copper']],
            discards: [['estate']],
            d
        });
        player.testPlayAction('hermit');
        player.testHookNextDecision((d) => {
            expect(d.decision).to.equal('chooseCard');
            if (d.decision === 'chooseCard') {
                expect(d.source.map((a) => a.name)).to.contain('estate');
            }
        });
        player.testChooseCard(Texts.chooseCardToTrashFor('hermit'), 'estate');
        player.testGain('hermit', 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['silver']);
            expect(game.trash.map((a) => a.name)).to.have.members(['estate']);
            // Get rid of a copper just so the shuffle works out
            const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.name === 'copper'), 1)[0];
            game.trash.push(card);
        });
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.contain('madman');
            expect(game.trash.map((a) => a.name)).to.have.members(['hermit', 'copper', 'estate']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'hermit', 'estate', 'duchy']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'hermit');
        player.testChooseCard(Texts.chooseCardToTrashFor('hermit'), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashFor('hermit'), 'duchy');
        player.testGain('hermit', 'silver');
        player.testGain('hermit', 'silver');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['estate', 'duchy']);
        });
        player.testPlayAction('No Card');
        player.onBuyPhaseStart(() => {
            expect(game.trash.map((a) => a.name)).to.have.members(['estate', 'duchy', 'hermit']);
            done();
        });
        game.start();
    })
});
