import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

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
                player.lm('%p gains a curse.');
            }
            else {
                player.lm('%p does not gain a curse.');
            }
        });
    }
}
