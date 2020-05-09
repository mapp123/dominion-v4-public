import Card from "../Card";
import type Player from "../../server/Player";

export default class Witch extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "witch";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Each other player gains a Curse.";
    supplyCount = 10;
    cardArt = "/img/card-img/WitchArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(2, true);
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            if (!await p.gain('curse')) {
                p.lm('%p does not gain a curse.');
            }
        });
    }
}
