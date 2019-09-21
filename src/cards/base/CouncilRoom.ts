import Card from "../Card";
import Player from "../../server/Player";

export default class CouncilRoom extends Card {
    types = ["action"] as const;
    name = "council room";
    cost = {
        coin: 5
    };
    cardText = "+4 Cards\n" +
        "+1 Buy\n" +
        "Each other player draws a card.";
    supplyCount = 10;
    cardArt = "/img/card-img/Council_RoomArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(4);
        player.data.buys += 1;
        await player.affectOthersInOrder(async (p) => {
            await p.draw();
        });
    }
}
