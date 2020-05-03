import {readdirSync} from "fs";
import {resolve} from "path";
import makeTestGame, {getPlayerUnderTestResults, setPlayerUnderTest} from "./testBed";
import BigMoney from "../src/server/ai/BigMoney";
import Game from "../src/server/Game";
import PlayerEffects from "../src/server/PlayerEffects";
import chaiSnapshot = require('mocha-chai-snapshot');
import chai = require('chai');
import snapshots = require('./__snapshots__/CardsAndAI.spec.js.snap.js');
const {expect} = chai;
chai.use(chaiSnapshot);

describe('CARDS', () => {
    before(() => {
        // Setup AI tests
        const [game] = makeTestGame({
            players: 0
        });
        setPlayerUnderTest(new BigMoney(game));
    });
    const dir = readdirSync(__dirname, {
        withFileTypes: true
    });
    dir.filter((a) => a.isDirectory()).forEach((box) => {
        describe(box.name.replace(/([A-Z])/g, " $1").toUpperCase(), () => {
            const cards = readdirSync(resolve(__dirname, box.name));
            cards.filter((a) => /.*\.spec\.js$/.test(a)).forEach((card) => {
                process.env.NODE_ENV = '';
                process.env.SKIP_WAITS = 'true';
                process.env.FORCE_COLONY = 'true';
                process.env.SHOULD_LOG_PRIVATE = 'yes';
                require(resolve(__dirname, box.name, card));
            });
        });
    });
    describe('EFFECTS', () => {
        it('has no new cards', function () {
            // @ts-ignore
            const effects = PlayerEffects.__testingCards;
            const effectObj = Object.fromEntries(Object.entries(effects).map(([effect, set]) => {
                return [effect, (set || ([] as Array<any>)).map((item) => item.name).filter((a, i, arr) => arr.indexOf(a) === i)];
            }));
            try {
                // @ts-ignore
                expect(effectObj).to.matchSnapshot(this);
            }
            catch (e) {
                // We'll re-throw this, as we want the test to fail, but we probably want some diagnostic information as well.
                const old = snapshots['CARDS : EFFECTS : has no new cards 1'];
                const bad = Object.entries(effectObj).map(([effectName, cards]) => {
                    return [effectName, cards.filter((a) => !old[effectName]?.includes(a))] as const;
                }).filter(([, cards]) => cards.length > 0);
                bad.forEach(([effectName, cards]) => {
                    cards.forEach((card) => {
                        const incompat = effects[effectName].filter((a) => a.name !== card).filter((effectDef) => {
                            return typeof effectDef.config.compatibility === 'function' ? !effectDef.config.compatibility(card, ...(effectDef.lastCall ?? [])) : !effectDef.config.compatibility[card];
                        });
                        console.log(`Please check the following cards against ${effectName}[${card}]: ${incompat.map((a) => a.name).filter((a, i, arr) => arr.indexOf(a) === i).join(",")}`);
                    });
                })
                throw e;
            }
        });
    });
});
describe('AI', () => {
    it('plays a game', (d) => {
        const [game, , done] = makeTestGame({
            players: 0,
            d
        });
        game.players.push(new BigMoney(game));
        (game.players[0] as any).decisionResponses = [];
        game.gameEnded = Game.prototype.gameEnded as any;
        game.events.on('gameEnd', () => {
            done();
            return false;
        });
        game.start();
    });
    it('handles every decision in testing',() => {
        const decisions = getPlayerUnderTestResults();
        for (const [decision, error] of decisions) {
            if (error) {
                console.log(decision);
                throw error;
            }
        }
    });
});