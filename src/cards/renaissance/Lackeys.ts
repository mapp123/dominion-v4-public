import Card from "../Card";
import type Player from "../../server/Player";

export default class Lackeys extends Card {
    intrinsicTypes = ["action"] as const;
    name = "lackeys";
    features = ["villagers"] as const;
    intrinsicCost = {
        coin: 2
    };
    cardText = "+2 Cards\n" +
        "---\n" +
        "When you gain this, +2 Villagers.";
    supplyCount = 10;
    cardArt = "/img/card-img/LackeysArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2);
    }
    onGainSelf(player: Player): Promise<void> | void {
        player.data.villagers += 2;
    }
}
