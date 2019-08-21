import makeTestGame from "./testBed";
import BigMoney from "../src/server/BigMoney";
import Game from "../src/server/Game";

describe.skip('AI', () => {
    it('plays a game', (d) => {
        const [game, players, done] = makeTestGame({
            players: 0,
            d
        });
        game.players.push(new BigMoney(game));
        (game.players[0] as any).decisionResponses = [];
        game.gameEnded = Game.prototype.gameEnded as any;
        game.start();
    });
});