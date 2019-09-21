import Card from "../Card";
import Player from "../../server/Player";

export default class Lackeys extends Card {
    types = ["action"] as const;
    name = "lackeys";
    features = ["villagers"] as const;
    cost = {
        coin: 2
    };
    cardText = "+2 Cards\n" +
        "When you gain this, +2 Villagers.";
    supplyCount = 10;
    cardArt = "/img/card-img/LackeysArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(2);
    }
    onGainSelf(player: Player): Promise<void> | void {
        player.data.villagers += 2;
    }
}
