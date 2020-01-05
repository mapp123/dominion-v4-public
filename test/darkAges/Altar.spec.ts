import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('ALTAR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['altar', 'copper', 'silver']],
            d,
            activateCards: ['market', 'smithy']
        });
        player.testPlayAction('altar');
        player.testChooseCard(Texts.chooseCardToTrashFor('altar'),'copper');
        player.testGain('altar', 'market');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['market']);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'altar', 'copper', 'silver', 'gold']],
            d,
            activateCards: ['market', 'smithy']
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'altar');
        player.testChooseCard(Texts.chooseCardToTrashFor('altar'),'copper');
        player.testGain('altar', 'market');
        player.testChooseCard(Texts.chooseCardToTrashFor('altar'),'silver');
        player.testGain('altar', 'market');
        player.onBuyPhaseStart(() => {
            expect(player.discardPile).to.have.members(['market', 'market']);
            expect(game.trash.map((a) => a.name)).to.have.members(['copper', 'silver']);
            done();
        });
        game.start();
    })
});
