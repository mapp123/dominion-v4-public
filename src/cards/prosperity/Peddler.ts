import Card from "../Card";
import Cost from '../../server/Cost';
import type Player from "../../server/Player";
import type Game from "../../server/Game";

export default class Peddler extends Card {
    static descriptionSize = 51;
    intrinsicTypes = ["action"] as const;
    name = "peddler";
    intrinsicCost = {
        coin: 8
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+$1\n" +
        "---\n" +
        "During your Buy phase, this costs $2 less per Action card you have in play, but not less than $0.";
    supplyCount = 10;
    cardArt = "/img/card-img/PeddlerArt.jpg";
    static smallText = true;
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        player.data.money += 1;
    }
    public static getCostModifier(cardData: any, game: Game): {[card: string]: Cost} | null {
        const actionsInPlay = game.players[game.currentPlayerIndex].data.playArea.filter((a) => a.types.includes("action"));
        return {
            peddler: Cost.create(-(actionsInPlay.length * 2))
        };
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('actionCardPlayed', () => {
            game.updateCostModifiers();
            return true;
        });
        game.events.on('turnEnd', () => {
            game.updateCostModifiers();
            return true;
        });
    }
}
