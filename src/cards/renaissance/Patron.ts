import Card from "../Card";
import type Player from "../../server/Player";

export default class Patron extends Card {
    static descriptionSize = 18;
    intrinsicTypes = ["action", "reaction"] as const;
    name = "patron";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Villager\n" +
        "+$2\n" +
        "---\n" +
        "When something causes you to reveal this (using the word \"reveal\"),\n" +
        "+1 Coffers";
    features = ["villagers", "coffers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/PatronArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.villagers++;
        player.data.money += 2;
    }
    onRevealSelf(player: Player): Promise<void> | void {
        player.data.coffers++;
    }
}
