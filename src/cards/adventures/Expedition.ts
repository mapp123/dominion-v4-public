import type Player from "../../server/Player";
import Event from "../Event";

export default class Expedition extends Event {
    cardArt = "/img/card-img/800px-ExpeditionArt.jpg";
    cardText = "Draw 2 extra cards for your next hand.";
    intrinsicCost = {
        coin: 3
    };
    name = "expedition";
    async onPurchase(player: Player): Promise<any> {
        player.effects.setupEffect('handDraw', this.name, {
            compatibility: {
                flag: true
            }
        }, async (remove) => {
            await player.draw(2, false);
            remove();
        });
    }
}