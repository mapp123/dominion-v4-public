import Card from "../Card";
import type Player from "../../server/Player";

export default class LostCity extends Card {
    intrinsicTypes = ["action"] as const;
    name = "lost city";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "+2 Actions\n" +
        "---\n" +
        "When you gain this, each other player draws a card.";
    supplyCount = 10;
    cardArt = "/img/card-img/Lost_CityArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2);
        player.data.actions += 2;
    }
    async onGainSelf(player: Player): Promise<void> {
        await player.affectOthers(async (p) => await p.draw());
    }
}
