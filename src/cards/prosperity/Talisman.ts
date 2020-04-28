import Card from "../Card";
import type Player from "../../server/Player";
import type Game from "../../server/Game";
import Cost, {CostResult} from "../../server/Cost";

export default class Talisman extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "talisman";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$1\n" +
        "---\n" +
        "While this is in play, when you buy a non-Victory card costing $4 or less, gain a copy of it.";
    supplyCount = 10;
    cardArt = "/img/card-img/TalismanArt.jpg";
    intrinsicValue = 1;
    async onPlay(player: Player): Promise<void> {
        player.data.money += 1;
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('buy', 'talisman', {
                compatibility: {
                    hovel: true,
                    hoard: true,
                    mint: true
                },
                relevant: (card) => player.data.playArea.some((a) => a.name === 'talisman') && !game.getTypesOfCard(card).includes('victory') && game.getCostOfCard(card).compareTo(Cost.create(5)) === CostResult.LESS_THAN,
                duplicate: () => player.data.playArea.filter((a) => a.name === 'talisman').map((a) => a.id)
            }, async (remove, cardName) => {
                player.lm('%p gains an extra %s with talisman.', cardName);
                await player.gain(cardName, undefined, false);
            });
        });
    }
}
