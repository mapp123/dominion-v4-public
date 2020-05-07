import Game from "../../src/server/Game";
import FakeIO from "./FakeIO";
import {expect} from 'chai';
import AIPlayer from "../../src/server/ai/AIPlayer";

describe('GAME', () => {
    let game: Game;
    let io: FakeIO;
    beforeEach(() => {
        game = new Game(FakeIO as any);
        io = FakeIO.currentFake;
        process.env.FORCE_COLONY = 'false';
    });
    it('responds to select cards', async () => {
        const socket = io.createFakeSocket();
        io.connectFakeSocket(socket);
        socket.emit('setCards', ['cellar']);
        expect(game.selectedCards).to.have.members(['copper', 'silver', 'gold', 'estate', 'duchy', 'province', 'curse', 'cellar']);
    });
    it('handles bad messages', (done) => {
        const socket = io.createFakeSocket();
        io.connectFakeSocket(socket);
        socket.waitFor('invalidMsg').then((result) => {
            expect(result).to.have.ordered.members(['setCards', 1]);
            done();
        });
        socket.emit('setCards', 1);
    });
    it('picks AIs', () => {
        const socket = io.createFakeSocket();
        io.connectFakeSocket(socket);
        socket.emit('setAIPlayers', 1);
        expect(game.players[0]).to.be.instanceOf(AIPlayer);
    });
})