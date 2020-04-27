import Card from "../Card";
import type Player from "../../server/Player";

export default class DistantLands extends Card {
    static typelineSize = 45;
    intrinsicTypes = ["action","reserve","victory"] as const;
    name = "distant lands";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Put this on your Tavern mat.";
    supplyCount = 10;
    cardArt = "/img/card-img/Distant_LandsArt.jpg";
    public static onScore(player) {
        return player.data.tavernMat.filter((a) => a.card.name === 'distant lands').length * 4;
    }
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        if (tracker.hasTrack) {
            player.lm('%p puts a distant lands on their tavern mat.');
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
        }
    }
}
