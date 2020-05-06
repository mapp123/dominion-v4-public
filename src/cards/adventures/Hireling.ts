import Card from "../Card";
import type Player from "../../server/Player";

export default class Hireling extends Card {
    static typelineSize = 63;
    intrinsicTypes = ["action","duration"] as const;
    name = "hireling";
    intrinsicCost = {
        coin: 6
    };
    cardText = "At the start of each of your turns for the rest of the game: \n" +
        "+1 Card\n" +
        "i(This stays in play.)";
    supplyCount = 10;
    cardArt = "/img/card-img/HirelingArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.effects.setupEffect('turnStart', this.name, {
            compatibility: {
                'haunted woods': true,
                'cargo ship': true,
                research: true,
                'sinister plot': true
            }
        }, async () => {
            await player.draw();
        });
    }
    shouldDiscardFromPlay(): boolean {
        return false;
    }
}
