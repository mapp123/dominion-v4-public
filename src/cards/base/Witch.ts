import Card from "../Card";
import Player from "../../server/Player";

export default class Witch extends Card {
    types = ["action","attack"] as const;
    name = "witch";
    cost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Each other player gains a Curse.";
    supplyCount = 10;
    cardArt = "/img/card-img/WitchArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.draw(2);
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const c = await p.gain('curse');
            if (c) {
                p.lm('%p gains a curse.');
            }
            else {
                p.lm('%p does not gain a curse.');
            }
        });
    }
}
