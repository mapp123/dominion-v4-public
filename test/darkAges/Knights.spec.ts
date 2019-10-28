import makeTestGame from "../testBed";
import { expect } from 'chai';
import {Texts} from "../../src/server/Texts";
import {knightNames} from "../../src/cards/darkAges/Knights";
import Util from "../../src/Util";

describe('KNIGHTS', () => {
    knightNames.forEach((knight) => {
        describe(knight.toUpperCase(), () => {
            it('works normally', (d) => {
                const [game, [player, q], done] = makeTestGame({
                    decks: [[knight, 'copper', 'copper', 'copper', 'copper', 'silver', 'gold'], ['copper', 'copper', 'copper', 'copper', 'copper', 'silver', 'gold']],
                    d,
                    players: 2
                });
                player.testPlayAction(knight);
                switch (knight) {
                    case 'dame anna':
                        player.testChooseCard(Texts.chooseCardToTrashFor('dame anna'), 'copper');
                        player.testChooseCard(Texts.chooseCardToTrashFor('dame anna'), 'No Card');
                        break;
                    case 'dame natalie':
                        player.testGain(knight, 'silver');
                        break;
                    case 'sir michael':
                        q.testChooseCard(Texts.chooseCardToDiscardFor(knight), 'copper');
                        q.testChooseCard(Texts.chooseCardToDiscardFor(knight), 'copper');
                        break;
                }
                q.testChooseCard(Texts.chooseCardToTrashFor(knight), 'gold');
                player.onBuyPhaseStart(() => {
                    switch (knight) {
                        case 'dame anna':
                            expect(player.hand).to.have.members(['copper', 'copper', 'copper']);
                            break;
                        case 'dame natalie':
                            expect(player.discardPile).to.have.members(['silver']);
                            break;
                        case 'dame molly':
                            expect(player.data.actions).to.equal(2);
                            break;
                        case 'dame sylvia':
                            expect(player.data.money).to.equal(2);
                            break;
                        case 'sir bailey':
                            expect(player.data.actions).to.equal(1);
                            break;
                        case 'sir martin':
                            expect(player.data.buys).to.equal(3);
                            break;
                    }
                    expect(q.discardPile).to.have.members([
                        'silver',
                        knight === 'sir michael' ? 'copper' : undefined,
                        knight === 'sir michael' ? 'copper' : undefined
                    ].filter(Util.nonNull));
                    expect(game.trash.map((a) => a.name)).to.have.members([
                        'gold',
                        knight === 'dame anna' ? 'copper' : undefined
                    ].filter(Util.nonNull));
                    expect(player.hand).to.have.members([
                        'copper',
                        'copper',
                        'copper',
                        knight === 'dame anna' ? undefined : 'copper',
                        knight === 'sir bailey' || knight === 'sir destry' ? 'silver' : undefined,
                        knight === 'sir destry' ? 'gold' : undefined
                    ].filter(Util.nonNull));
                    done();
                });
                game.start();
            });
            switch (knight) {
                case 'dame josephine':
                    it('scores', (d) => {
                        const [game, [player], done] = makeTestGame({
                            decks: [[knight]],
                            d
                        });
                        player.testPlayAction('No Card');
                        player.testEndGame();
                        player.onScore((score) => {
                            expect(score).to.equal(2);
                            done();
                        });
                        game.start();
                    });
                    break;
                case 'sir vander':
                    it('gains on trash', (d) => {
                        const [game, [player], done] = makeTestGame({
                            decks: [[knight, 'chapel']],
                            d
                        });
                        player.testPlayAction('chapel');
                        player.testChooseCard(Texts.chooseCardToTrashFor('chapel'), knight);
                        player.onBuyPhaseStart(() => {
                            expect(player.discardPile).to.have.members(['gold']);
                            done();
                        });
                        game.start();
                    });
                    break;
            }
        });
    });
});
