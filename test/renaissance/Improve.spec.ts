import makeTestGame from "../testBed";
import {Texts} from "../../src/server/Texts";

describe('IMPROVE', () => {
    it('works normally', (d) => {
        const [game, [player]] = makeTestGame({
            decks: [['improve'], ['throne room']],
            d
        });
        player.testPlayAction('improve');
        player.endTurn();
        player.testChooseCard(Texts.chooseCardToTrashFor('improve'), 'improve');
        player.testGain('improve', 'throne room');
        player.testEndGameNow();
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player]] = makeTestGame({
            decks: [['throne room', 'improve']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'improve');
        player.endTurn();
        player.testChooseCard(Texts.chooseCardToTrashFor('improve'), 'improve');
        player.testGain('improve', 'throne room');
        player.testChooseCard(Texts.chooseCardToTrashFor('improve'), 'No Card');
        player.testEndGameNow();
        game.start();
    })
});
