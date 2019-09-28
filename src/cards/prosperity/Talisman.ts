import Card from "../Card";
import Player from "../../server/Player";
import Game from "../../server/Game";

export default class Talisman extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "talisman";
    cost = {
        coin: 4
    };
    cardText = "+$1\n" +
        "---\n" +
        "While this is in play, when you buy a non-Victory card costing $4 or less, gain a copy of it.";
    supplyCount = 10;
    cardArt = "/img/card-img/TalismanArt.jpg";
    protected async onTreasure(player: Player): Promise<void> {
        player.data.money += 1;
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('buy', async (player, cardName) => {
            const cardsInPlay = player.data.playArea.filter((a) => a.name === 'talisman');
            for (let i = 0; i < cardsInPlay.length; i++) {
                if (!game.getCard(cardName).types.includes("victory")) {
                    player.lm('%p gains an extra %s with talisman.', cardName);
                    await player.gain(cardName, undefined, false);
                }
            }
            return true;
        });
    }
}
