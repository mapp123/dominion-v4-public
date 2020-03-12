import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";

describe('GEAR', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['gear', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'copper']],
            d
        });
        player.testPlayAction('gear');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'silver');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
        });
        player.onBuyPhaseStart(() => {
            expect(player.playArea).to.have.members(['gear']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'gear', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold', 'copper', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'gear');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'silver');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'silver');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'gold');
        player.testChooseCard(Texts.chooseCardToSetAsideFor('gear'), 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
        });
        player.onBuyPhaseStart(() => {
            expect(player.playArea).to.have.members(['gear', 'throne room']);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'silver', 'gold', 'gold']);
            done();
        });
        game.start();
    })
});
