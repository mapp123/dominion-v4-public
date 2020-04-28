import Card from "../Card";
import type Player from "../../server/Player";

export default class Spoils extends Card {
    static inSupply = false;
    randomizable = false;
    intrinsicTypes = ["treasure"] as const;
    name = "spoils";
    intrinsicCost = {
        coin: 0
    };
    cardText = "$3\n" +
        "When you play this, return it to the Spoils pile.\n" +
        "(This is not in the Supply.)";
    supplyCount = 15;
    cardArt = "/img/card-img/SpoilsArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.money += 3;
        if (tracker.hasTrack) {
            const card = tracker.exercise();
            if (card) {
                player.game.supply.getPile('spoils')?.push(card);
            }
        }
    }
}
