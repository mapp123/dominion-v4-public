import Card from "../Card";
import Player from "../../server/Player";

export default class ActingTroupe extends Card {
    intrinsicTypes = ["action"] as const;
    name = "acting troupe";
    cost = {
        coin: 3
    };
    cardText = "+4 Villagers\n" +
        "Trash this.";
    features = ["villagers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/Acting_TroupeArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.villagers += 4;
        if (player.data.playArea.find((a) => a.id === this.id)) {
            let [toTrash] = player.data.playArea.splice(player.data.playArea.findIndex((a) => a.id == this.id), 1);
            await player.trash(toTrash);
        }
    }
}
