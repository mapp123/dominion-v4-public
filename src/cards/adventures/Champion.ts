import Card from "../Card";
import type Player from "../../server/Player";

export default class Champion extends Card {
    static descriptionSize = 50;
    static typelineSize = 63;
    intrinsicTypes = ["action","duration"] as const;
    name = "champion";
    intrinsicCost = {
        coin: 6
    };
    cardText = "+1 Action\n" +
        "For the rest of the game, when another player plays an Attack card, it doesn't affect you, and when you play an Action, +1 Action.\n" +
        "(This stays in play. This is not in the Supply.)";
    supplyCount = 5;
    cardArt = "/img/card-img/ChampionArt.jpg";
    randomizable = false;
    static inSupply = false;
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        player.effects.setupEffect('willPlayAction', 'champion', {
            compatibility: () => true
        }, async () => {
            player.data.actions++;
        });
    }
    shouldDiscardFromPlay(): boolean {
        return false;
    }
    async onAttackInPlay(): Promise<boolean> {
        return true;
    }
}
