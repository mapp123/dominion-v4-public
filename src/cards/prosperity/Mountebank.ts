import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Mountebank extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "mountebank";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "Each other player may discard a Curse. If they don't, they gain a Curse and a Copper.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-MountebankArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.money += 2;
        await player.attackOthersInSteps<boolean>(exemptPlayers, [
            async (p) => {
                if (p.data.hand.find((a) => a.name === 'curse') != null && await p.confirmAction(Texts.doYouWantToDiscardAnAForB('curse', 'mountebank'))) {
                    const card = p.data.hand.find((a) => a.name === 'curse')!;
                    p.data.hand.splice(p.data.hand.indexOf(card), 1);
                    p.lm('%p discards a curse.');
                    await p.discard(card);
                    return true;
                }
                return false;
            },
            async (p, result) => {
                if (!result) {
                    await p.gain('curse', undefined, true);
                    await p.gain('copper', undefined, true);
                }
            }
        ]);
    }
}
