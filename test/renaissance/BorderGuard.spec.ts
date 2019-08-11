import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import CardRegistry from "../../src/cards/CardRegistry";
import Lantern from "../../src/cards/renaissance/Lantern";
import Horn from "../../src/cards/renaissance/Horn";

describe('BORDER GUARD', () => {
    it('works normally', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['border guard', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper']],
            d
        });
        player.testPlayAction('border guard');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
            done();
        });
        game.start();
    });
    it('gives artifact', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['border guard', 'copper', 'copper', 'copper', 'copper', 'border guard', 'border guard']],
            d
        });
        player.testPlayAction('border guard');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'border guard');
        player.testOption(Texts.whichArtifactWouldYouLike, 'lantern');
        player.testPlayAction('border guard');
        player.testPlayAction('border guard');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper']);
            expect((CardRegistry.getInstance().getCard('lantern') as any as typeof Lantern).getI(game).belongsToPlayer).to.equal(player);
            done();
        });
        game.start();
    });
    it('works with lantern', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['border guard', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper', 'gold']],
            d
        });
        player.testHookNextDecision(() => {
            (CardRegistry.getInstance().getCard('lantern') as any as typeof Lantern).giveTo(player);
        });
        player.testPlayAction('border guard');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'gold');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'gold']);
            done();
        });
        game.start();
    });
    it('works with horn', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['border guard', 'copper', 'copper', 'copper', 'copper', 'silver', 'copper']],
            d
        });
        player.testHookNextDecision(() => {
            (CardRegistry.getInstance().getCard('horn') as any as typeof Horn).giveTo(player);
        });
        player.testPlayAction('border guard');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'silver');
        player.testHookNextDecision(() => {
            expect(player.data.actions).to.equal(1);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'copper', 'silver']);
        });
        player.endTurn();
        player.testConfirm(Texts.doYouWantToPutTheAOnYourDeck('border guard'), true);
        player.testEndGameNow();
        game.start();
    });
    it('can be throne roomed', (d) => {
        const [game, [player], done] = makeTestGame({
            decks: [['throne room', 'border guard', 'copper', 'copper', 'copper', 'silver', 'copper', 'silver', 'copper']],
            d
        });
        player.testPlayAction('throne room');
        player.testChooseCard(Texts.chooseCardToPlayTwice, 'border guard');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'silver');
        player.testChooseCard(Texts.chooseCardToTakeFromRevealed, 'silver');
        player.onBuyPhaseStart(() => {
            expect(player.data.actions).to.equal(2);
            expect(player.hand).to.have.members(['copper', 'copper', 'copper', 'silver', 'silver']);
            done();
        });
        game.start();
    })
});
