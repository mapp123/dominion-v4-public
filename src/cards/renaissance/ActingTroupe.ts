import Card from "../Card";
import type Player from "../../server/Player";

export default class ActingTroupe extends Card {
    intrinsicTypes = ["action"] as const;
    name = "acting troupe";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+4 Villagers\n" +
        "Trash this.";
    features = ["villagers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/Acting_TroupeArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.villagers += 4;
        if (tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
        }
    }
}
