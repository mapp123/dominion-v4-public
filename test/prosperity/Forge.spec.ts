import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('FORGE', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['forge', 'copper', 'copper', 'gold', 'estate']],
            d
        });
        player.testPlayAction('forge');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'gold');
        player.testChooseCard(Texts.chooseCardToTrashForge(6), 'estate');
        player.testGain(Texts.chooseCardToGainFor('forge'), 'province');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['province']);
            done();
        });
        game.start();
    });
    it('works with bad combinations', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['forge', 'estate', 'estate']],
            d
        });
        player.testPlayAction('forge');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashForge(2), 'estate');
        player.onBuyPhaseStart(() => {
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'forge', 'copper', 'gold', 'estate']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'forge');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'No Card');
        player.testGain(Texts.chooseCardToGainFor('forge'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashForge(0), 'gold');
        player.testChooseCard(Texts.chooseCardToTrashForge(6), 'estate');
        player.testGain(Texts.chooseCardToGainFor('forge'), 'province');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['copper', 'province']);
            done();
        });
        game.start();
    })
});
