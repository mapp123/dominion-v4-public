import Card from "../Card";
import type Player from "../../server/Player";
import type Game from "../../server/Game";

export default class Hoard extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "hoard";
    intrinsicCost = {
        coin: 6
    };
    cardText = "+$2\n" +
        "---\n" +
        "While this is in play, when you buy a Victory card, gain a Gold.";
    supplyCount = 10;
    cardArt = "/img/card-img/HoardArt.jpg";
    intrinsicValue = 2;
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(2);
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('buy', 'hoard', {
                compatibility: {
                    hovel: true
                },
                relevant: (card) => game.getTypesOfCard(card).includes('victory'),
                duplicate: () => player.data.playArea.filter((a) => a.name === 'hoard').map((a) => a.id)
            }, async () => {
                await player.gain('gold');
            });
        });
    }
}
