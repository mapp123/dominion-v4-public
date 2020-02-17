import {readdirSync} from "fs";
import {resolve} from "path";
import makeTestGame, {getPlayerUnderTestResults, setPlayerUnderTest} from "./testBed";
import BigMoney from "../src/server/ai/BigMoney";
import Game from "../src/server/Game";
import PlayerEffects from "../src/server/PlayerEffects";
import chaiSnapshot = require('mocha-chai-snapshot');
import chai = require('chai');
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
            expect(Object.fromEntries(Object.entries(effects).map(([effect, set]) => {
                return [effect, [...(set?.values() || [])]];
                // @ts-ignore
            }))).to.matchSnapshot(this);
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