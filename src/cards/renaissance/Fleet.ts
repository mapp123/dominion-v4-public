import Project from "../Project";
import Player from "../../server/Player";
import Game from "../../server/Game";

export default class Fleet extends Project {
    cardArt = "/img/card-img/FleetArt.jpg";
    cardText = "After the game ends, there's an extra round of turns just for players with this.";
    intrinsicCost = {
        coin: 5
    };
    name = "fleet";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.lm('%p will get an extra turn at the end of the game.');
    }
    public static setup(cardData: any, game: Game) {
        game.events.on('scoreStart', async () => {
            game.lm(null, 'The game is ending. Everyone that purchased fleet will now get an extra turn.');
            const playersToRun = game.players.slice(game.currentPlayerIndex).concat(game.players.slice(0, game.currentPlayerIndex)).filter((a) => (this.getInstance(a) as any).playersJoined.includes(a));
            for (const player of playersToRun) {
                await player.playTurn();
            }
            return true;
        });
    }
}