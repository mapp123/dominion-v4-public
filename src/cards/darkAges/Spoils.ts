import Card from "../Card";
import Player from "../../server/Player";

export default class Spoils extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "spoils";
    cost = {
        coin: 0
    };
    cardText = "$3\n" +
        "When you play this, return it to the Spoils pile.\n" +
        "(This is not in the Supply.)";
    supplyCount = 15;
    cardArt = "/img/card-img/SpoilsArt.jpg";
    async onTreasure(player: Player, tracker): Promise<void> {
        player.data.money += 3;
        if (tracker.hasTrack) {
            const card = tracker.exercise();
            if (card) {
                player.game.supply.getPile('spoils')?.push(card);
            }
        }
    }
}
