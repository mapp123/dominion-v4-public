import Card from "../Card";
import type Player from "../../server/Player";

export default class Port extends Card {
    intrinsicTypes = ["action"] as const;
    name = "port";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "---\n" +
        "When you buy this, gain another Port.";
    supplyCount = 10;
    cardArt = "/img/card-img/PortArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions += 2;
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        const ret = await player.gain(this.cardName, undefined, false);
        player.lm('%p gains another port.');
        await player.gain('port', undefined, false);
        return ret;
    }
}
