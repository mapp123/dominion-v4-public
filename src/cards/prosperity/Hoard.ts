import Card from "../Card";
import Player from "../../server/Player";
import Game from "../../server/Game";

export default class Hoard extends Card {
    types = ["treasure"] as const;
    name = "hoard";
    cost = {
        coin: 6
    };
    cardText = "+$2\n" +
        "While this is in play, when you buy a Victory card, gain a Gold.";
    supplyCount = 10;
    cardArt = "/img/card-img/HoardArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 2;
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('buy', async (player, card) => {
            if (game.getTypesOfCard(card).includes("victory")) {
                const hoardsInPlay = player.data.playArea.filter((a) => a.name === 'hoard');
                for (let i = 0; i < hoardsInPlay.length; i++) {
                    await player.gain('gold');
                }
            }
            return true;
        });
    }
}
