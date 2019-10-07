import Card from "../Card";
import Player from "../../server/Player";

export default class Madman extends Card {
    static inSupply = false;
    intrinsicTypes = ["action"] as const;
    name = "madman";
    cost = {
        coin: 0
    };
    cardText = "+2 Actions\n" +
        "Return this to the Madman pile. If you do, +1 Card per card in your hand.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/MadmanArt.jpg";
    randomizable = false;
    async onAction(player: Player): Promise<void> {
        player.data.actions += 2;
        if (player.data.playArea.some((a) => a.id === this.id)) {
            const card = player.data.playArea.splice(player.data.playArea.findIndex((a) => a.id === this.id), 1)[0];
            player.game.supply.getPile('madman')?.unshift(card);
            await player.draw(player.data.hand.length);
        }
    }
}
