import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('CHAPEL', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chapel', 'estate', 'copper', 'copper', 'copper']],
            d
        });
        player.testPlayAction('chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['chapel', 'throne room', 'estate', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'chapel');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'estate');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'copper');
        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), 'No Card');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper']);
            done();
        });
        game.start();
    })
});