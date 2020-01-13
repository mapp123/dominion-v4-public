import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Cultist extends Card {
    static typelineSize = 48;
    static descriptionSize = 57;
    intrinsicTypes = ["action","attack","looter"] as const;
    name = "cultist";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Each other player gains a Ruins. You may play a Cultist from your hand.\n" +
        "---\n" +
        "When you trash this, +3 Cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/CultistArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(2);
        await player.attackOthers(exemptPlayers, async (p) => {
            await p.gain('ruins');
        });
        if (player.data.hand.find((a) => a.name === 'cultist') && await player.confirmAction(Texts.playCardFromHand('cultist'))) {
            const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.name === 'cultist'), 1)[0];
            player.data.playArea.push(card);
            await player.playActionCard(card, null);
        }
    }
    async onTrashSelf(player: Player): Promise<void> {
        await player.draw(3);
    }
}
