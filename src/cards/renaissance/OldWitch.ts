import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class OldWitch extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "old witch";
    cost = {
        coin: 5
    };
    cardText = "+3 Cards\n" +
        "Each other player gains a Curse and may trash a Curse from their hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/Old_WitchArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(3);
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            await p.gain('curse');
        });
        await player.attackOthers(exemptPlayers, async (p) => {
            if (p.data.hand.some((a) => a.name === 'curse') && await p.confirmAction(Texts.doYouWantToTrashA('curse'))) {
                const [card] = p.data.hand.splice(p.data.hand.findIndex((a) => a.name === 'curse'), 1);
                await p.trash(card);
            }
        });
    }
}
