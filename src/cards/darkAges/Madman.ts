import Card from "../Card";
import type Player from "../../server/Player";

export default class Madman extends Card {
    static inSupply = false;
    intrinsicTypes = ["action"] as const;
    name = "madman";
    intrinsicCost = {
        coin: 0
    };
    cardText = "+2 Actions\n" +
        "Return this to the Madman pile. If you do, +1 Card per card in your hand.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/MadmanArt.jpg";
    randomizable = false;
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.actions += 2;
        if (tracker.hasTrack) {
            player.game.supply.getPile('madman')?.unshift(tracker.exercise()!);
            await player.draw(player.data.hand.length);
        }
    }
}
