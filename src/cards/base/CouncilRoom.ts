import Card from "../Card";
import type Player from "../../server/Player";

export default class CouncilRoom extends Card {
    intrinsicTypes = ["action"] as const;
    name = "council room";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+4 Cards\n" +
        "+1 Buy\n" +
        "Each other player draws a card.";
    supplyCount = 10;
    cardArt = "/img/card-img/Council_RoomArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(4);
        player.data.buys += 1;
        await player.affectOthersInOrder(async (p) => {
            await p.draw();
        });
    }
}
